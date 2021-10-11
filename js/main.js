let video = document.getElementById('video')
let toggle = document.getElementById('toggle')
let play = document.getElementsByClassName('play')
let pause = document.getElementsByClassName('pause')
let current = document.getElementById('currentTime')
let duration = document.getElementById('durationTime')
let progress = document.getElementById('progress')
let progressBar = document.getElementById('progressBar')
let volumeBar = document.getElementById('volumeBar')
let volume = document.getElementById('volumeLevel')
let volumeLine = document.getElementsByClassName('volume_line')
let videoBar = document.getElementsByClassName('video_bar')[0]

let progressDrag = false
let volumeDrag = false
let volumeBarX = null

const updateVideoStatus = () => {
    if(video.paused){
        pause[0].classList.remove('current')
        play[0].classList.add('current')
    }else{
        play[0].classList.remove('current')
        pause[0].classList.add('current')
    }
}
video.volume = 0.25
const updateProgress = (currentTime, durationTime) => {
    progress.style.width = !currentTime ? currentTime : ((currentTime * 100 ) / durationTime) + '%'
}
const updateVolume = (volumeLevel) => {
    volume.style.width = volumeLevel * 100  + '%'
}

const timeFormatter = (seconds) => {
    seconds = Math.floor(seconds)
    let full = Math.floor(seconds/60)
    let secs = seconds%60
    if(secs < 10){
        secs = '0' + secs
    }

    return `${full}:${secs}`
}

const setDuration = () => {
    duration.innerText = timeFormatter(video.duration)
}

const updateCurrentTime = () => {
    current.innerText = timeFormatter(Math.floor(video.currentTime))
}

setInterval( () => !video.paused && updateCurrentTime(), 1000)
setInterval( () => !video.paused && updateProgress(video.currentTime, video.duration), 200)

const toggleVideo = async () => {
    if(video.paused){
        await video.play()
    }else{
        await video.pause()
    }
}

toggle.addEventListener('click', toggleVideo)
video.addEventListener('click', toggleVideo)
document.addEventListener('keydown', e => {
    if(e.code === 'Space'){
        toggleVideo()
    }else if(e.code === 'ArrowRight'){
        video.currentTime = Math.floor(video.currentTime + 5)
        updateCurrentTime()
        updateProgress(video.currentTime, video.duration)
    }else if(e.code === 'ArrowLeft'){
        video.currentTime = Math.floor(video.currentTime - 5)
        updateCurrentTime()
        updateProgress(video.currentTime, video.duration)
    }
})
video.addEventListener( 'play' , updateVideoStatus)
video.addEventListener( 'pause' , updateVideoStatus)
video.addEventListener( 'loadeddata' , () => {
    updateVolume(video.volume)
    updateVideoStatus()
    setDuration()
})
progressBar.addEventListener('mousedown', e => {  
    progressDrag = true
    video.currentTime = (video.duration/100) * ( (e.offsetX * 100) / progressBar.offsetWidth)
    if(!video.paused){
        video.pause()
    }
    videoBar.style.transform = 'translate(0, 0)'
    videoBar.style.opacity = 1
    updateCurrentTime()
    updateProgress(video.currentTime, video.duration)
})
progressBar.addEventListener('mousemove', e => {
    if(progressDrag){
        progress.children[0].style.opacity = 1
        video.currentTime = (video.duration/100) * ( (e.offsetX * 100) / progressBar.offsetWidth)
        updateCurrentTime()
        updateProgress(video.currentTime, video.duration)
    }
})

video.addEventListener('mousemove',  e => {
    // console.log(e.offsetX, volumeBar.offsetWidth);
    
    if(progressDrag){
        progress.children[0].style.opacity = 1
        video.currentTime = (video.duration/100) * ( (e.offsetX * 100) / progressBar.offsetWidth)
        updateCurrentTime()
        updateProgress(video.currentTime, video.duration)
    }else if(volumeDrag){
        
            console.log(e.offsetX, volumeBarX, ((e.offsetX - (volumeBarX - volumeBar.offsetWidth) )));
            if(((e.offsetX - (volumeBarX - volumeBar.offsetWidth)  ) / volumeBar.offsetWidth) > 1){
                video.volume = 1
            }else if(((e.offsetX - (volumeBarX - volumeBar.offsetWidth) ) / volumeBar.offsetWidth) < 0){
                video.volume = 0
            }else{
                video.volume = (e.offsetX - (volumeBarX - volumeBar.offsetWidth)  ) / volumeBar.offsetWidth
            }
            updateVolume(video.volume)
        }
})
volumeBar.addEventListener('mousemove', e => {
    if(volumeDrag){
        if((e.offsetX / volumeBar.offsetWidth) > 1){
            video.volume = 1
        }else if((e.offsetX / volumeBar.offsetWidth) < 0){
            video.volume = 0
        }else{
            video.volume = e.offsetX / volumeBar.offsetWidth
        }
        updateVolume(video.volume)
    }
})
document.addEventListener('mouseup', () => {
    if(progressDrag) {
        progress.children[0].style.opacity = 0
        toggleVideo()
    }
    volumeLine[0].style.width = 0
    videoBar.style.transform = null
    videoBar.style.opacity = null
    progressDrag = false
    volumeDrag = false
})

volumeBar.addEventListener('mousedown', e => {
    console.log(e);
    volumeBarX = e.clientX - e.offsetX
    volumeDrag = true
    video.volume = e.offsetX / volumeBar.offsetWidth
    volumeLine[0].style.width = 80 + 'px'
    updateVolume(video.volume)
})