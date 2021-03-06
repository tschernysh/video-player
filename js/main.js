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
let infoDisplay = document.getElementById('infoDisplay')
let volumeIcon = document.getElementById('volumeIcon')

let progressDrag = false
let volumeDrag = false
let volumeBarX = null
let videoBarX = null
let timer



const updateVideoStatus = () => {
    if(video.paused){
        pause[0].classList.remove('current')
        play[0].classList.add('current')
    }else{
        play[0].classList.remove('current')
        pause[0].classList.add('current')
    }
}

video.volume = 1    


const updateProgress = (currentTime, durationTime) => {
    progress.style.width = !currentTime ? currentTime : ((currentTime * 100 ) / durationTime) + '%'
}
const updateVolume = (volumeLevel, load) => {
    console.log('xyu');
    volume.style.width = volumeLevel * 100  + '%'
    !load && showVolumeLevel()
    if(+video.volume === 0 || video.muted){
        changeVolumeIcon('muted')
    }else if (+video.volume <= 0.3){
        changeVolumeIcon('volume-low')
    }else if (+video.volume <= 0.7 && +video.volume > 0.3){
        changeVolumeIcon('volume-med')
    }else if (+video.volume <= 1 && +video.volume > 0.7){
        changeVolumeIcon('volume-max')
    }
}

const toggleMuteVideo = () => {
    video.muted = !video.muted
    if(video.muted){
        showMutedDisplay()
        volume.style.width = 0
    }else{
        showVolumeLevel()
        updateVolume(video.volume)
    }
}

const changeVolumeIcon = (state) => {
    switch(state){
        case 'muted':
            volumeIcon.attributes.src.value = 'icons/volume-mute-solid.svg'
            return
        case 'volume-low':
            volumeIcon.attributes.src.value = 'icons/volume-low.svg'
            return
        case 'volume-med':
            volumeIcon.attributes.src.value = 'icons/volume-med.svg'
            return
        case 'volume-max':
            volumeIcon.attributes.src.value = 'icons/volume-max.svg'
            return
        default: return
    }
}

const timeFormatter = (seconds) => {
    seconds = Math.floor(seconds)
    let hours
    let minutes = Math.floor(seconds/60)
    let secs = seconds%60
    if(secs < 10){
        secs = '0' + secs
    }
    if(minutes >= 60){
        hours = Math.floor(minutes/60)
        minutes %= 60
    }
    if(hours && minutes < 10){
        minutes = '0' + minutes
    }

    return `${hours ? (hours + ':'): '' }${minutes}:${secs}`
}

const showVolumeLevel = () => {
    clearInterval(timer)
    infoDisplay.innerText = `${Math.round(video.volume * 100)}%`
    infoDisplay.style.opacity = 1
    timer = setInterval(() => {
        infoDisplay.style.opacity = 0
    }, 1000);
}

const showVideoDisplay = () => {
    clearInterval(timer)
    infoDisplay.innerText = timeFormatter(Math.floor(video.currentTime))
    infoDisplay.style.opacity = 1
    timer = setInterval(() => {
        infoDisplay.style.opacity = 0
    }, 1000);
}
const showMutedDisplay = () => {
    clearInterval(timer)
    infoDisplay.innerText = 'muted'
    infoDisplay.style.opacity = 1
    timer = setInterval(() => {
        infoDisplay.style.opacity = 0
    }, 1000);
}

const setDuration = () => {
    duration.innerText = timeFormatter(video.duration)
}

const updateCurrentTime = () => {
    current.innerText = timeFormatter(Math.floor(video.currentTime))
}

const toggleVideo = async () => {
    if(video.paused){
        await video.play()
    }else{
        await video.pause()
        showVideoDisplay()
    }
}

setInterval( () => !video.paused && updateCurrentTime(), 1000)
setInterval( () => !video.paused && updateProgress(video.currentTime, video.duration), 200)


video.onvolumechange = () => {
    updateVolume(video.volume, true)
}
video.onplay = updateVideoStatus
video.onpause = updateVideoStatus
volumeIcon.onclick = toggleMuteVideo 
toggle.onclick = toggleVideo
video.onclick = toggleVideo
video.onloadeddata = () => {
    updateVolume(video.volume, true)
    updateVideoStatus()
    setDuration()
}
video.ontimeupdate = () => {
    updateCurrentTime()
    updateProgress(video.currentTime, video.duration)
}


document.addEventListener('keydown', e => {
    if(e.code === 'Space'){
        toggleVideo()
    }else if(e.code === 'ArrowRight'){
        video.currentTime = Math.floor(video.currentTime + 5)
        showVideoDisplay()
    }else if(e.code === 'ArrowLeft'){
        video.currentTime = Math.floor(video.currentTime - 5)
        showVideoDisplay()
    }else if(e.code === 'ArrowUp'){
        video.muted = false
        if(video.volume + 0.05 >= 1){
            video.volume = 1
        }else{
            video.volume += 0.05
        }
        showVolumeLevel()
    }else if(e.code === 'ArrowDown'){
        video.muted = false
        if(video.volume - 0.05 <= 0){
            video.volume = 0
        }else{
            video.volume -=0.05
        }
        showVolumeLevel()
    }else if(e.code === 'KeyM'){
        toggleMuteVideo()
    }
})


progressBar.addEventListener('mousedown', e => {  
    videoBarX = e.clientX - e.offsetX
    progressDrag = true
    video.currentTime = (video.duration/100) * ( (e.offsetX * 100) / progressBar.offsetWidth)
    showVideoDisplay()
    if(!video.paused){
        video.pause()
    }
    videoBar.style.transform = 'translate(0, 0)'
    videoBar.style.opacity = 1
})
document.addEventListener('mousemove',  e => {
    if(progressDrag){
        showVideoDisplay()
        progress.children[0].style.opacity = 1
        if((video.duration/100) * ( ((e.clientX - videoBarX) * 100) / progressBar.offsetWidth) > video.duration){
            video.currentTime = video.duration    
        }else if((video.duration/100) * ( ((e.clientX - videoBarX) * 100) / progressBar.offsetWidth) < 0){
            video.currentTime = 0
        }else{
            video.currentTime = (video.duration/100) * ( ((e.clientX - videoBarX) * 100) / progressBar.offsetWidth)
        }
        updateCurrentTime()
        updateProgress(video.currentTime, video.duration)
    }else if(volumeDrag){
        if(((e.clientX - volumeBarX) / volumeBar.offsetWidth) > 1){
            video.volume = 1
        }else if(((e.clientX - volumeBarX) / volumeBar.offsetWidth) < 0){
            video.volume = 0
        }else{
            video.volume = ((e.clientX - volumeBarX) / volumeBar.offsetWidth)
        }
        showVolumeLevel()
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
    video.muted = false
    volumeBarX = e.clientX - e.offsetX
    volumeDrag = true
    video.volume = (Math.floor((e.offsetX / volumeBar.offsetWidth) * 100))/100
    volumeLine[0].style.width = 80 + 'px'
})
