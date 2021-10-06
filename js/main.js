let video = document.getElementById('video')
let toggle = document.getElementById('toggle')
let play = document.getElementsByClassName('play')
let pause = document.getElementsByClassName('pause')


const updateVideoStatus = () => {
    if(video.paused){
        pause[0].classList.remove('current')
        play[0].classList.add('current')
    }else{
        play[0].classList.remove('current')
        pause[0].classList.add('current')
    }
}



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