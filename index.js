const { entrypoints } = require("uxp");

const runx1 = true;
const runx2 = false;


// Set up entry points -- this defines the handler for menu items
// If this plugin had a panel, we would define flyout menu items here
entrypoints.setup({
  commands: {
    runx1: () => main(runx1),
    runx2: () => main(runx2),
    
  }
});


async function main(bool){
  const app = require('photoshop').app;
  const { zeroPad, splitCategoryName, isPSFile, formatString, checkFolderExist} = require('./scripts/utils.js');
  
  app.bringToFront();

  const fs = require("uxp").storage.localFileSystem;

  const actionSet = app.actionTree;
  var action_uxp = actionSet.filter(action => action.name == "UXP_dynamic_lighning")[0];

  if (!action_uxp)
  {
    return;
  }

  const action_dynamic_light = action_uxp.actions

  await app.showAlert("Select Input Folder");

  // open folder location
  const inputDir = await fs.getFolder();

  // alert choose outfile
  await app.showAlert("Select Output Folder");

  // select output folder
  const outputDir = await fs.getFolder();

  // read file name of input
  var inputArray = await inputDir.getEntries();

  //loop tung file
  var listCat = [];

  for (var i = 0; i < inputArray.length; i++){
    if (isPSFile(inputArray[i].name)){
      let splitNames = splitCategoryName(inputArray[i].name);
      var category = splitNames[0];
      var theme = splitNames[1];

      var catIndex = listCat.findIndex(cat => cat == category);

      if(catIndex < 0)
      {
        catIndex = listCat.length;
        listCat.push(category);
      }

      let catPath = zeroPad(catIndex, 3) + formatString(category);

      const catFolder = await checkFolderExist(outputDir, catPath);

      const subThemes = await catFolder.getEntries();

      var themeIndex = 0;

      if (subThemes.length > 0)
      {
        themeIndex = subThemes.length;
      }

      let themePath = zeroPad(themeIndex, 3) + formatString(theme);
      
      const themeFolder = await checkFolderExist(catFolder, themePath);

      var open_document = await app.open(inputArray[i]);

      if(bool == true){
        for(var k = 0; k < action_dynamic_light.length; k++){
          await action_dynamic_light[k].play();
          const tempFile = await themeFolder.createFile("image_" + action_dynamic_light[k].name + '.png');
          await open_document.save(tempFile);
        }
      }else{
        const tempFile = await themeFolder.createFile('Store.png');
        await open_document.save(tempFile);
      }
      

      open_document.closeWithoutSaving();
    }
  }
}
