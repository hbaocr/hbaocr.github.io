let selectedDeviceId;

async function CameraSelectionEnum() {
    const sourceSelect = document.getElementById('sourceSelect');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    sourceSelect.innerHTML = options.join('');
    sourceSelect.onchange = () => {
        selectedDeviceId = sourceSelect.value;
        CameraStart(selectedDeviceId)
    };

    sourceSelect.onclick = () => {
        selectedDeviceId = sourceSelect.value;
        CameraStart(selectedDeviceId)
    };

    const sourceSelectPanel = document.getElementById('sourceSelectPanel');
    sourceSelectPanel.style.display = 'block';
};

function CameraStart(myExactCameraOrBustDeviceId) {
    const video = document.getElementById('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        //let constraint={ video: { deviceId: { exact: myExactCameraOrBustDeviceId } } }
        let constraint = {
            audio: false,
            video: {
                width: { min: 1280, ideal: 2048 },
                height: { min: 720, ideal: 1152 },
            
                deviceId: {
                    exact: myExactCameraOrBustDeviceId
                }
            }
        }

        navigator.mediaDevices.getUserMedia(constraint).then(function (stream) {
            video.srcObject = stream;
            video.play();
        });
    }

}

function CameraInit() {
    console.log('Camera initialized');
    CameraSelectionEnum();
}

function getCenterFrame(canvas_ele){
    let w = canvas_ele.width;
    let h = canvas_ele.height;
    let rect_size ={
        x:Math.floor(0.7*w),
        y:Math.floor(0.3*h)
    }
    let rect_start = {
        x: Math.floor((w - rect_size.x) / 2),
        y: Math.floor((h - rect_size.y) / 2)
    }
    return {rect_start,rect_size}

}




