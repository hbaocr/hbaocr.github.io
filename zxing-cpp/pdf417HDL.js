

//https://github.com/zxing-js/browser#readme
const decode_fps = 4;
const video_fps = 15;
let video_canvas_org;
let rect_start;
let rect_size;
let display_w = 240;
//getTestImage();


function resizeCanvas(canvas_src, canvas_dst, factor) {

    const cw = canvas_src.width;
    const ch = canvas_src.height;

    canvas_dst.width = Math.floor(cw * factor);
    canvas_dst.height = Math.floor(ch * factor);
    const ctx = canvas_dst.getContext('2d');
    ctx.drawImage(canvas_src, 0, 0, cw, ch, 0, 0, canvas_dst.width, canvas_dst.height);

}

function render_video_frame() {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    const video = document.getElementById('video');
    let w = video.videoWidth;
    let h = video.videoHeight;

    if ((w == 0) || (h == 0)) {
        return;// skip
    }
    canvas.width = w;
    canvas.height = h

    ctx.drawImage(video, 0, 0);
    let res = getCenterFrame(canvas);

    rect_start = { ...res.rect_start };
    rect_size = { ...res.rect_size };

    ctx.lineWidth = 5;
    ctx.rect(rect_start.x, rect_start.y, rect_size.x, rect_size.y);
    ctx.stroke();

    //resize and display to canvasVideo
    let display_canvas = document.getElementById('canvasVideo');
    display_canvas.width = display_w;
    resize_canvas(canvas, display_canvas);
    video_canvas_org = canvas;
}



setInterval(() => {
    render_video_frame();
}, Math.floor(1000 / video_fps))


setInterval(() => {
    if (rect_start && (rect_start.x > 0) && video_canvas_org) {
       // let canvas1 = video_canvas_org.cloneNode();
        let cropped_canvas = crop_the_picture(video_canvas_org, rect_start, rect_size);
        //let decode_input = document.createElement('canvas');
       
        //resizeCanvas(cropped_canvas,decode_input,1.5);
        document.getElementById('Resolution').innerHTML = `frame ${video_canvas_org.width} x ${video_canvas_org.height}`;
        decode_zxing(cropped_canvas)
   
    }

}, Math.floor(1000 / decode_fps))





function get_video_frame() {
    return video_canvas_org;
}

let zxing = ZXing().then(function (instance) {
    zxing = instance; // this line is supposedly not required but with current emsdk it is :-/
});

function scanBarcodeCanvas(canvasElement, format) {

    var imgWidth = canvasElement.width;
    var imgHeight = canvasElement.height;
    var imageData = canvasElement.getContext('2d').getImageData(0, 0, imgWidth, imgHeight);
    var sourceBuffer = imageData.data;

    var buffer = zxing._malloc(sourceBuffer.byteLength);
    zxing.HEAPU8.set(sourceBuffer, buffer);
    var result = zxing.readBarcodeFromPixmap(buffer, imgWidth, imgHeight, true, format);
    zxing._free(buffer);
    return result;
}

async function decode_zxing(canvas) {

    if (canvas.height == 0) return;

    if (!zxing) return;

    try {
        let t = new Date().getTime();
        result=scanBarcodeCanvas(canvas,"")
        let nt = new Date().getTime();
        if(result.text.length>0){
            document.getElementById('result').innerHTML = result.text;
            window.alert(result.text);
        }
        let {format,text,error}=result;
       
        console.log(nt-t,format,text,error)
       
        
    } catch (err) {
        document.getElementById('Error').innerHTML = err;
        console.log(err);

    }


}





function preProcessingImage(canvas) {
    //let ctx = canvas.getContext('2d');
    let pixels = ImageFilter.pixel2Canvas(canvas);//ctx.getImageData(0,0,canvas.width,canvas.height);
    let kernel_sz = Math.floor(canvas.width / 20);
    kernel_sz = kernel_sz * 2 + 1;
    let thr_compensation = 15;
    let options = {
        size: kernel_sz,/* kernel size */
        compensation: thr_compensation, /* the avg_mean will be subtract   */
        singleChannel: false
    }

    //let gray_bitmap=ImageFilter.grayscale(pixels);

    let thr_bitmap = ImageFilter.adaptiveThreshold(pixels, options)
    return ImageFilter.pixel2Canvas(thr_bitmap);

}