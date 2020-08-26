import { ipcRenderer, app } from 'electron';
import { Store } from './store';
import * as fs from 'fs';
import { LaunchApp } from './application/launchApp';
import {
  LaunchArg,
  LaunchArgOptionProps,
  LaunchArgValue,
  LaunchArgType,
  LaunchArgDisplay,
} from './application/launchArg';

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-settings',
  defaults: {
    appsConfigPath: '',
  },
});

const title = document.getElementById('title');
const profile_content = document.getElementById('application-arguments');
const drag_region = document.getElementById('wrapper');
const applications_pane = document.getElementById('applications-list');
const main_pane = document.getElementById('arguments');
const launch_btn = document.getElementById('launch-btn');
const command_txt = document.getElementById('command-text');
const console_size_toggle = document.getElementById('console-size-toggle');

let apps: LaunchApp[] = [];
type ConsoleVisibilityMode = 'expanded' | 'collapsed' | 'hidden';
let consoleVisibility: ConsoleVisibilityMode = 'collapsed';

loadApps();
drawApps();
if (apps.length > 0) {
  selectApp(0);
}

let currentApp: LaunchApp;
let highlightedArgumentIndex: number = -1;

if (drag_region) {
  drag_region.ondragover = () => {
    return false;
  };
  drag_region.ondragleave = () => {
    return false;
  };
  drag_region.ondragend = () => {
    return false;
  };
  drag_region.ondrop = (e) => {
    e.preventDefault();
    let filePath = '';
    if (e.dataTransfer) {
      filePath = e.dataTransfer.files[0].path;
    }

    console.log(filePath);
    store.set('appsConfigPath', filePath);
    loadApps();
    drawApps();
    return false;
  };
}

if (launch_btn) {
  launch_btn.addEventListener('click', () => {
    console.log(`Launching ${currentApp.name}`);
    console.log(currentApp.argString);
    ipcRenderer.send('launch', currentApp.argArray);
  });
}
if (console_size_toggle) {
  console_size_toggle.addEventListener('click', () => {
    setConsoleVisibility(
      consoleVisibility == 'expanded' ? 'collapsed' : 'expanded',
    );
  });
}

if (command_txt) {
  command_txt.addEventListener('copy', (event) => {
    const selection = document.getSelection();

    if (event.clipboardData) {
      event.clipboardData.setData(
        'text/plain',
        (selection || '')
          .toString()
          .replace(/‑/g, '-')
          .replace(/\u200B/g, ''),
      );
    }

    event.preventDefault();
  });
}

function loadApps(): void {
  let appsConfigPath = store.get('appsConfigPath');

  if (appsConfigPath == undefined || appsConfigPath.length == 0) {
    console.log('Applications file not set.');
    return;
  }

  if (!fs.existsSync(appsConfigPath)) {
    console.log(
      `Applications file missing. Expected file at "${appsConfigPath}".`,
    );
    return;
  }

  let raw: any = JSON.parse(fs.readFileSync(appsConfigPath).toString());
  let loadedApps: LaunchApp[] = [];
  // Build and log each process.
  for (const o of raw.applications) {
    let launchApp: LaunchApp = new LaunchApp({
      name: o.name,
      executablePath: o.path,
    });

    for (const a of o.args) {
      launchApp.addLaunchArg(a);
    }

    launchApp.debugPrint();
    console.log(launchApp);
    loadedApps.push(launchApp);
  }

  apps = loadedApps;
}

/**
 * Builds the application element for the Application list.
 * @param app
 * @param index
 * @param selected
 */
function buildApplicationNode(
  app: LaunchApp,
  index: number,
  selected: boolean = false,
): HTMLDivElement {
  let el: HTMLDivElement = document.createElement('div');
  el.className = 'app';
  if (selected) el.classList.add('selected');

  // When clicking the application list item, select it.
  el.addEventListener('click', () => {
    selectApp(index);
  });

  // The application list item has a label.
  let label: HTMLHeadingElement = document.createElement('h2');
  label.textContent = app.name;

  // The application list item has a quicklaunch button.
  let quickLaunchButton: HTMLElement = document.createElement('i');
  quickLaunchButton.className = 'fas fa-external-link-alt tiny-btn';
  quickLaunchButton.setAttribute('title', `Quicklaunch ${app.name}`);
  quickLaunchButton.addEventListener('click', (ev) => {
    // Prevent the click from also selecting the item.
    ev.stopPropagation();
    console.log(`Quick-launching [${index}] ${app.name}`);
    ipcRenderer.send('launch', app.argArray);
  });

  el.appendChild(label);
  el.appendChild(quickLaunchButton);

  return el;
}

function drawApps(): void {
  // Clear all children in the Applications list.
  if (!applications_pane) return;

  while (applications_pane.lastChild) {
    applications_pane.removeChild(applications_pane.lastChild);
  }

  for (let index = 0; index < apps.length; ++index) {
    let app = apps[index];
    applications_pane.appendChild(
      buildApplicationNode(app, index, app == currentApp),
    );
  }
}

function selectApp(index: number): void {
  currentApp = apps[index];
  if (title) title.textContent = currentApp.name;

  ipcRenderer.send('updateTitle', currentApp.name);
  console.log(`Process ${index} selected.`);
  if (profile_content) {
    while (profile_content.lastElementChild) {
      profile_content.removeChild(profile_content.lastElementChild);
    }

    for (let i = 0; i < currentApp.args.length; ++i) {
      let el = buildArgumentNode(currentApp, i);
      if (el != null) profile_content.appendChild(el);
    }
  }

  drawApps();
  renderArguments(currentApp.argArray);
}

function buildArgumentNode(
  launchApp: LaunchApp,
  index: number,
): HTMLDivElement | null {
  const argument: LaunchArg = launchApp.args[index];

  if (argument.display === LaunchArgDisplay.Hidden) {
    return null;
  }

  // All arguments are inside their own div.
  let el = document.createElement('div');
  el.className = `argument`;
  el.classList.add(argument.inputType);

  // All arguments have a label.
  let label = document.createElement('label');
  label.htmlFor = `arg${index}`;
  label.textContent = argument.name;
  if (argument.hasTooltip) {
    label.setAttribute('title', `${argument.tooltip}`);
  }

  if (argument.type === LaunchArgType.Option) {
    // Option types are composed of multiple items.
    let select = document.createElement('select');
    select.name = argument.name;
    select.id = `arg${index}`;

    select.addEventListener('change', () => {
      updateArgument(index, select.selectedIndex);
    });

    // Build the options.
    const options = (argument.props as LaunchArgOptionProps).options;
    for (let i = 0; i < options.length; ++i) {
      let option = document.createElement('option');
      option.value = i.toString();
      option.innerText = options[i][0];
      select.appendChild(option);
    }

    select.selectedIndex = argument.value as number;
    el.appendChild(label);
    el.appendChild(document.createElement('br'));
    el.appendChild(select);
  } else {
    // The other types just have a single <input>
    let input = document.createElement('input');
    input.name = argument.name;
    input.id = `arg${index}`;
    input.type = argument.inputType;

    // Build DOM structure based on the type of argument.
    switch (argument.type) {
      case LaunchArgType.Boolean:
        input.defaultChecked = argument.value as boolean;
        input.addEventListener('click', () => {
          updateArgument(index, input.checked);
        });
        el.appendChild(input);
        el.appendChild(label);
        break;
      case LaunchArgType.String:
        input.value = argument.value as string;
        input.addEventListener('input', () => {
          updateArgument(index, input.value);
        });
        el.appendChild(label);
        el.appendChild(document.createElement('br'));
        el.appendChild(input);
        break;
      case LaunchArgType.Number:
        input.value = argument.value.toString();
        input.addEventListener('input', () => {
          updateArgument(index, input.value);
        });
        el.appendChild(label);
        el.appendChild(document.createElement('br'));
        el.appendChild(input);
        break;
      default:
        break;
    }
  }

  let hoverArea = document.createElement('i');
  hoverArea.className = 'fas fa-binoculars highlight-icon';

  // Handle element highlighting.
  hoverArea.addEventListener('mouseenter', () => {
    renderArguments(currentApp.argArray, index + 1);
  });
  hoverArea.addEventListener('mouseleave', () => {
    renderArguments(currentApp.argArray, -1);
  });

  label.appendChild(hoverArea);

  return el;
}

function updateArgument(index: number, value: LaunchArgValue) {
  currentApp.args[index].value = value;
  renderArguments(currentApp.argArray);
}

function renderArguments(args: string[], index?: number): void {
  if (!command_txt) return;

  let command = '';

  if (index != null) highlightedArgumentIndex = index;

  for (let i = 0; i < args.length; ++i) {
    let highlightedClass =
      highlightedArgumentIndex == i ? 'arg highlighted' : 'arg';
    if (args[i].length == 0) {
      command += `<span class="${highlightedClass} empty"></span>`;
    } else {
      let parsed = args[i]
        .replace(/-/g, '\u2011')
        .replace(/\\/g, '\\\u200B')
        .replace(/\//g, '/\u200B')
        .replace(/=/g, '=\u200B');
      command += ` <span class="${highlightedClass}">${parsed}</span>`;
    }

    command = command.trim();
  }

  command_txt.innerHTML = command;
  command_txt.className = `output ${consoleVisibility}`;
}

function setConsoleVisibility(visibility: ConsoleVisibilityMode): void {
  consoleVisibility = visibility;
  if (!(console_size_toggle && command_txt)) return;
  switch (visibility) {
    case 'collapsed':
      console_size_toggle.className = `fas fa-expand-alt tiny-btn`;
      break;
    case 'expanded':
      console_size_toggle.className = `fas fa-compress-alt tiny-btn`;
      break;
    case 'hidden':
      break;
  }

  command_txt.className = `output ${consoleVisibility}`;
}
