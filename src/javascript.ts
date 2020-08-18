import { ipcRenderer, app } from 'electron';
import { Store } from './store';
import * as fs from 'fs';
import { LaunchApp } from './application/launchApp';
import { LaunchArg, LaunchArgValue } from './application/launchArg';

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-settings',
  defaults: {
    appsConfigPath: ""
  }
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
if (apps.length > 0) {selectApp(0);}

let currentApp: LaunchApp;
let highlightedArgumentIndex: number = -1;

drag_region.ondragover = () => { return false; };
drag_region.ondragleave = () => { return false; };
drag_region.ondragend = () => { return false; };
drag_region.ondrop = (e) => {
  e.preventDefault();
  let filePath = e.dataTransfer.files[0].path
  console.log(filePath);
  store.set("appsConfigPath", filePath);
  loadApps();
  drawApps();
  return false;
};

launch_btn.addEventListener('click' , () => {
  console.log(`Launching ${currentApp.name}`);
  console.log(currentApp.argString);
  ipcRenderer.send('spawn', currentApp.argArray);
});

console_size_toggle.addEventListener('click', () => {
  setConsoleVisibility(consoleVisibility == 'expanded' ? 'collapsed': 'expanded');
});

function loadApps(): void {
  let appsConfigPath = store.get("appsConfigPath");
  
  if (appsConfigPath == undefined ||appsConfigPath.length == 0) {
    console.log("Applications file not set.");
    return null;
  }

  if (!fs.existsSync(appsConfigPath)) {
    console.log(`Applications file missing. Expected file at "${appsConfigPath}".`);
    return null;
  }

  let raw: any = JSON.parse(fs.readFileSync(appsConfigPath).toString());
  let loadedApps: LaunchApp[] = [];
  // Build and log each process.
  for (const o of raw.applications)
  {
    let launchApp: LaunchApp = new LaunchApp({name: o.name, executablePath: o.path});

    for (const a of o.args)
    {
      launchApp.addLaunchArg(a);
    }

    launchApp.debugPrint();
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
function buildApplicationNode(app: LaunchApp, index: number, selected: boolean = false): HTMLDivElement {
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
    ipcRenderer.send('spawn', app.argArray);
  });

  el.appendChild(label);
  el.appendChild(quickLaunchButton);

  return el;
}

function drawApps(): void
{
  // Clear all children in the Applications list.
  while (applications_pane.lastChild) {
    applications_pane.removeChild(applications_pane.lastChild);
  }

  for (let index = 0; index < apps.length; ++index) {
    let app = apps[index];
    applications_pane.appendChild(buildApplicationNode(app, index, app == currentApp));
  }
}

function selectApp(index: number): void
{
  currentApp = apps[index];
  title.textContent = currentApp.name;
  
  ipcRenderer.send('updateTitle', currentApp.name);
  console.log(`Process ${index} selected.`);
  while (profile_content.lastElementChild) {
    profile_content.removeChild(profile_content.lastElementChild);
  }

  for (let i = 0; i < currentApp.args.length; ++i)
  {
    let el = buildArgumentNode(currentApp, i);
    if (el != null) profile_content.appendChild(el);
  }

  drawApps();
  renderArguments(currentApp.argArray);
}

function buildArgumentNode(launchApp: LaunchApp, index: number): HTMLDivElement
{
  const argument: LaunchArg = launchApp.args[index];
  
  if (argument.display == 'hidden') { return null; }
  
  let el = document.createElement("div");
  el.className = `argument`;
  el.classList.add(argument.inputType);
  let input = document.createElement("input");
  input.name = argument.name;
  input.id = `arg${index}`;
  input.type = argument.inputType;
  let label = document.createElement("label");
  label.htmlFor = `arg${index}`;
  label.textContent = argument.name;
  

  // Build DOM structure based on the type of argument.
  switch (argument.type)
  {
    case "boolean":
      input.defaultChecked = argument.value as boolean;
      input.addEventListener('click', () => {
        updateArgument(index, input.checked);
      });
      el.appendChild(input);
      el.appendChild(label);
      break;
    case "string":
      input.value = argument.value as string;
      input.addEventListener('input', () => {
        updateArgument(index, input.value);
      });
      el.appendChild(label);
      el.appendChild(document.createElement("br"));
      el.appendChild(input);
      break;
    case "number":
      input.value = argument.value.toString();
      input.addEventListener('input', () => {
        updateArgument(index, input.value);
      });
      el.appendChild(label);
      el.appendChild(document.createElement("br"));
      el.appendChild(input);
    default:
      break;
  }

  let hoverArea = document.createElement("i");
  hoverArea.className = "fas fa-binoculars highlight-icon";

  // Handle element highlighting.
  hoverArea.addEventListener('mouseenter', () => {renderArguments(currentApp.argArray, index + 1);});
  hoverArea.addEventListener('mouseleave', () => {renderArguments(currentApp.argArray, -1);});

  label.appendChild(hoverArea);

  return el;
}

function updateArgument(index: number, value: LaunchArgValue) {
  currentApp.args[index].value = value;
  renderArguments(currentApp.argArray);
}

function renderArguments(args: string[], index?: number): void {
  let command = "";

  if (index != null) highlightedArgumentIndex = index;

  for (let i=0; i<args.length; ++i)
  {
    let highlightedClass = (highlightedArgumentIndex == i) ? 'arg highlighted' : 'arg';
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
