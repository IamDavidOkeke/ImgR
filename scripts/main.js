const get = function(string){
   return document.querySelector(string)
}
const file = get('#file')
const inputWidth = get('#width')
const inputHeight = get('#height')
const factor = get('#factor')
const btnByPixels = get('#btnByPixels')
const btnByFactor = get('#btnByFactor')
const imgByPixels = get('#imgByPixels')
const downloadByPixels = get('#downloadByPixels')
const allScreenBtn = get('#allScreensBtn')
const fileName = get('#fileName')
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

const screens = [
   {
      tag: get('#phone'),
      anchor: get('#downloadPhone'),
      width: 480,
      height: 700
   },
   {
      tag: get('#tablet'),
      anchor: get('#downloadTablet'),
      width: 1080,
      height: 1200
   },
   {
      tag: get('#desktop'),
      anchor: get('#downloadDesktop'),
      width: 1800,
      height: 1200
   }
]
file.addEventListener('change', function(){
   if(validateFile(file)){
      fileName.innerHTML = file.files[0].name
  } 
})

btnByPixels.addEventListener('click', function(){
   setImageUrl(imgByPixels, './styles/download.png')
   if(!validateFile(file)){
      confirm('Please select file')
      return;
  } 
  if(!validateInput(inputWidth.value) &&  !validateInput(inputHeight.value)){
  confirm('Please input desired width or height')
   return;
  }
  let imageFile = file.files[0]
  var resizedImageUrl;
  convertFileToUrl(imageFile, (url)=>{
   convertUrlToImage(url, (image)=>{
      let width = inputWidth.value
      let height = inputHeight.value
      if(width && !height){
         height = getAspectRatio( image.height, image.width) * width
         resizedImageUrl = resizeImage(image, width, height, imageFile.type)
      }else if(!width && height){
         width = getAspectRatio( image.width, image.height) * height
         resizedImageUrl = resizeImage(image, width, height, imageFile.type)
      }else{
         resizedImageUrl = resizeImage(image, width, height, imageFile.type)
      }
      setImageUrl(imgByPixels, resizedImageUrl)
      setAnchorUrl(downloadByPixels, resizedImageUrl)
   })
})   
})



btnByFactor.addEventListener('click', function(){
   setImageUrl(imgByFactor, './styles/download.png')
   if(!validateFile(file)){
      confirm('Please select file')
      return;
  }
   else if(!factor.value){
   confirm('Please input factor to scale by')
   return;
   }
   else{
      let imageFile = file.files[0]
      var resizedImageUrl;
      convertFileToUrl(imageFile, (url)=>{
       convertUrlToImage(url, (image)=>{
          let width = image.width * factor.value
          let height = image.height * factor.value
          resizedImageUrl = resizeImage(image, width, height, imageFile.type)
          setImageUrl(imgByFactor, resizedImageUrl)
          setAnchorUrl(downloadByFactor, resizedImageUrl)
       })
    })   
   }
})



allScreenBtn.addEventListener('click', function(){
   if(!validateFile(file)){
      confirm('Please select file')
      return;
  }
  let imageFile = file.files[0]
  convertFileToUrl(imageFile, (url)=>{
      convertUrlToImage(url, (image)=>{
         for(let i = 0; i<screens.length;i++){
            let resizedImageUrl = resizeImage(image, screens[i].width,screens[i].height, imageFile.type)
            setImageUrl(screens[i].tag, resizedImageUrl)
            setAnchorUrl(screens[i].anchor, resizedImageUrl)
          }
      })
   })
  
   }
  )

function getAspectRatio (x,y){
   return x/y
}
function setImageUrl (tag, url){
   tag.src = url
}
function setAnchorUrl (tag, url){
   tag.href = url
}
function validateFile(file){
  return file.files[0]? true : false
}
function validateInput(input){
   return input? true : false
}
 function convertFileToUrl(file, callback){
   let reader = new FileReader()
   reader.readAsDataURL(file)
   reader.onloadend =  function(e){
      if (callback){
          callback(e.target.result)
       }
  }
}
function convertUrlToImage(url, callback){
   let image = new Image()
   image.src = url
   image.onload =  function(){
       if (callback){
         callback(image)
       }
     }
}
function resizeImage(image, width, height, format){
     canvas.width = width
     canvas.height = height
     context.drawImage(image, 0, 0, canvas.width, canvas.height)
     let dataUrl = canvas.toDataURL(format)
     context.clearRect(0, 0, canvas.width, canvas.height)
     return dataUrl
}