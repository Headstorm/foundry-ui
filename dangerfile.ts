import {message, danger} from "danger"

const modifiedMD = danger.git.modified_files.join("- ")
message("Changed Files in this PR: \n - " + modifiedMD)

const deletedFiles = danger.git.deleted_files.join("- ")
message("Deleted Files in this PR: \n - " + deletedFiles)