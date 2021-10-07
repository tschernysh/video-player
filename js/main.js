let video = document.getElementById('video')
let toggle = document.getElementById('toggle')
let play = document.getElementsByClassName('play')
let pause = document.getElementsByClassName('pause')
let current = document.getElementById('currentTime')
let duration = document.getElementById('durationTime')
let progress = document.getElementById('progress')


const updateVideoStatus = () => {
    if(video.paused){
        pause[0].classList.remove('current')
        play[0].classList.add('current')
    }else{
        play[0].classList.remove('current')
        pause[0].classList.add('current')
    }
}

const updateProgress = (currentTime, durationTime) => {
    progress.style.width = !currentTime ? currentTime : ((currentTime * 100 ) / durationTime) + '%'
    
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
    updateVideoStatus()
    setDuration()
})
