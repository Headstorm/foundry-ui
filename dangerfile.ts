import { message, danger, warn, markdown} from "danger";
import { readFileSync } from "fs";
import { codeCoverage } from "danger-plugin-code-coverage";

const createdFiles = danger.git.created_files
const modifiedFiles = danger.git.modified_files
const deletedFiles = danger.git.deleted_files

const checkForComponents = (files) => {
    const componentPaths = files.filter(file => file.includes('src/components/'))
    const components = componentPaths.map(component => {
        component = component.slice(15)
        component = component.slice(0, component.indexOf('/'))
        return(component)
    })
    return(components.filter((item, index) => components.indexOf(item) === index));
}

const components = checkForComponents(createdFiles)
import * as exportedComponents from "./src";
const componentsNotExported = components.filter(component => !exportedComponents[component])

const BASE_DIR = 'base-build';
const HEAD_DIR = 'build2';

let headSha;
  let baseSha;
  try {
    headSha = (readFileSync(HEAD_DIR + '/COMMIT_SHA') + '').trim();
    baseSha = (readFileSync(BASE_DIR + '/COMMIT_SHA') + '').trim();
    message(`${headSha}...${baseSha}`)
  } catch {
    warn(
      "Failed to read build artifacts. It's possible a build configuration " +
        'has changed upstream. Try pulling the latest changes from the ' +
        'main branch.'
    );
  }

markdown(`
${componentsNotExported.length > 0?
    'Components added but not exported: ' + componentsNotExported
    : ''
}
`)
codeCoverage()