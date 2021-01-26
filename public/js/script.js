const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true
let messageInput = document.getElementById('message')
let messages = document.querySelector('.messages')
let messageCont = document.querySelector('.message-container')
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream)
    })
    socket.on('create-message', message => {
        let li = document.createElement('li')
        li.textContent = ` user : ${message}`
        messages.append(li)


    })

})

let peer = new Peer()
let myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})
peer.on('open', id => {

    socket.emit('join-user', ROOM_ID, id)
})




const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })


}



const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}


// Making a toggle for chat


let chat = document.getElementById('chat-button')
chat.addEventListener('click', () => {
    let main = document.querySelector('.main')
    let mainRight = document.querySelector('.main-right')
    main.classList.toggle('main-full')
    mainRight.classList.toggle('main-clear')
    console.log('you pressed chat button')
})



// Making a submit function

let submit = document.getElementById('submit')

submit.addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit('message', messageInput.value)
    let li = document.createElement('li')
    li.textContent = `You: ${messageInput.value}`
    messages.append(li)
    messageInput.value = ""
})
let helo = document.querySelector('.helo')



let mute = document.querySelector('.mute')




const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false
        setMuteButton()
    }
    else {
        myVideoStream.getAudioTracks()[0].enabled = true
        setUnmuteButton()
    }
}

document.querySelector('.main_mute').addEventListener('click', muteUnmute)
const setUnmuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span class="controls-span">mute</span>
    `

    document.querySelector('.main_mute').innerHTML = html
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone-slash"></i>
    <span class="controls-span">unmute</span>
    `
    document.querySelector('.main_mute').innerHTML = html
}


let videoMuteUnmute = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled

    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false
        setVideoPlay()
    }
    else {
        myVideoStream.getVideoTracks()[0].enabled = true
        setVideoPause()
    }
}

document.querySelector('.video_mute_unmute').addEventListener('click', videoMuteUnmute)

const setVideoPause = () => {
    let html = `
    <i class="fas fa-video"></i>
    <span class="controls-span">pause</span>
    `
    document.querySelector('.video_mute_unmute').innerHTML = html
}

const setVideoPlay = () => {
    let html = `
    <i class="fas fa-video-slash"></i>
    <span class="controls-span">play</span>
    
    `
    document.querySelector('.video_mute_unmute').innerHTML = html
}


let leave = document.querySelector('.right_controls')

leave.addEventListener('click', () => {
    myVideo.remove()
})