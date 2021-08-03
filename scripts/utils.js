function zeroPad (num, places)
{
    console.log(num + " " + places)
    return String(num).padStart(places, '0')
}

function splitCategoryName(inputString)
{
    let under_score_index = inputString.indexOf("_");
    return [inputString.slice(0, under_score_index), inputString.slice(under_score_index + 1, -4)]
}

function isPSFile(inputString)
{
    if (inputString.slice(-4) == ".psd" || inputString.slice(-4) == ".psb" ) 
    {
        return true        
    }
    else 
    {
        return false
    }
}

function formatString(str)
{
    console.log("format string");
    new_str ='';
    for(var i =0; i < str.length; i++)
    {
      if(str[i] == str[i].toUpperCase())
      {
        new_str += " ";
      }
      new_str += str[i];
    }
    console.log("new string: " + new_str);
    return new_str;
}

async function checkFolderExist(parent, child)
{
 
    let subFolders = await parent.getEntries(child);

    let foldersWithName = subFolders.filter(entry => entry.name == child);

    if (foldersWithName.length > 0)
    {
        console.log("folder exists");
        return foldersWithName[0];        
    }
    else 
    {
        console.log("Create new folder");
        let newFolder = await parent.createFolder(child);
        return newFolder;   
    }
}

module.exports = {
    checkFolderExist,
    formatString,
    isPSFile,
    splitCategoryName,
    zeroPad
}