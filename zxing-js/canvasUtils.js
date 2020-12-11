function resize_canvas(canvas_src, canvas_dst) {
    let settings = {
        max_width: canvas_dst.width,
        max_height: canvas_dst.height
    }
    let ratio = 1
    if (canvas_src.width > settings.max_width)
        ratio = settings.max_width / canvas_src.width
    else if (canvas_src.height > settings.max_height)
        ratio = settings.max_height / canvas_src.height

    canvas_dst.width = Math.floor(canvas_src.width * ratio)
    canvas_dst.height = Math.floor(canvas_src.height * ratio)
    let ctx = canvas_dst.getContext("2d");
    ctx.drawImage(canvas_src, 0, 0, canvas_src.width, canvas_src.height, 0, 0, canvas_dst.width, canvas_dst.height)
}

// Offset is boderline width of window
function crop_the_picture(canvas_src, start_point, dimension,offset=5,canvas_dst=null) {
    
    let canvas = canvas_dst||document.createElement('canvas');
    let ctx = canvas.getContext("2d");

    // ctx.drawImage(canvas_src,
    //     start_point.x, start_point.y,   // Start at x pixels from the left and y from the top of the image (crop),
    //     dimension.x+50, dimension.y+50,   // "Get"  (x * x) area from the source image (crop),
    //     0, 0,     // Place the result at 0, 0 in the canvas,
    //     dimension.x, dimension.y); // With as width / height: 160 * 60 (scale)
    canvas.width = dimension.x-2*offset;
    canvas.height=dimension.y-2*offset;
    ctx.drawImage(canvas_src,
        -start_point.x-offset,-start_point.y-offset
        )
    return canvas;
}