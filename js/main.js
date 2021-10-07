let video = document.getElementById('video')
let toggle = document.getElementById('toggle')
let play = document.getElementsByClassName('play')
let pause = document.getElementsByClassName('pause')
let current = document.getElementById('currentTime')


const updateVideoStatus = () => {
    console.log(video.currentTime);
    if(video.paused){
        pause[0].classList.remove('current')
        play[0].classList.add('current')
    }else{
        play[0].classList.remove('current')
        pause[0].classList.add('current')
    }
}


const timeFormatter = (seconds) => {
    let full = Math.floor(seconds/60)
    let secs = seconds%60
    
    if(secs < 10){
        secs = '0' + secs
    }

    return `${full}:${secs}`
}


const updateCurrentTime = () => {
    current.innerText = timeFormatter(Math.floor(video.currentTime))
}

setInterval( () => !video.paused && updateCurrentTime(), 1000)

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
    }
})
video.addEventListener( 'play' , updateVideoStatus)
video.addEventListener( 'pause' , updateVideoStatus)
video.addEventListener( 'loadeddata' , updateVideoStatus)
