<script lang="ts">
  let canvas: HTMLCanvasElement | null = null;
  let mouse_x: number|null = $state(null);
  let mouse_y: number|null = $state(null);
  let prevMouse_x = 0;
  let prevMouse_y = 0;
  let ctx = $state<CanvasRenderingContext2D| null>()
  let lineWidth = $state(40)
  let isDrawing = $state(false)
  let isCanvasEmpty = $state(true)
  let eraseOnEachDraw = $state(false)

  function handleDraw(x: number, y: number) {
    ctx = canvas?.getContext('2d')
    if (!ctx || !isDrawing ) return
    ctx.lineWidth = lineWidth
    ctx.lineCap="round";
    ctx.beginPath()
    ctx.moveTo(prevMouse_x,prevMouse_y);
    ctx.lineTo(x, y)
    ctx.strokeStyle = "white"
    ctx.stroke()
    prevMouse_x = x
    prevMouse_y = y
  }
  function resizeCanvasToParent() {
    if (!canvas || !canvas.parentElement) return
    canvas.width = canvas.parentElement.offsetWidth
    canvas.height = canvas.parentElement.offsetHeight
  }
  function get28x28Image(canvas: HTMLCanvasElement | null ) {
    if (!canvas) return
    let ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Initialize bounding box coordinates
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

    // Find the bounding box
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3]; // Alpha channel
            if (alpha > 0) { // Non-transparent pixel
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    // Check if there's a drawing
    if (minX > maxX || minY > maxY) {
        console.log("No drawing found.");
        return null;
    }

    // Calculate the width and height of the bounding rectangle
    const rectWidth = maxX - minX + 1;
    const rectHeight = maxY - minY + 1;

    // Extract the bounding rectangle
    const boundingImageData = ctx.getImageData(minX, minY, rectWidth, rectHeight);

    // Create a temporary canvas to hold the bounding rectangle
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rectWidth;
    tempCanvas.height = rectHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return
    tempCtx.putImageData(boundingImageData, 0, 0);

    // Create a 28x28 canvas
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 28;
    finalCanvas.height = 28;
    const finalCtx = finalCanvas.getContext('2d');

    // Clear the 28x28 canvas and center the image while scaling
    if (!finalCtx) return
    finalCtx.clearRect(0, 0, 28, 28);

    // Calculate scaling factor to fit the image in 28x28
    const scale = Math.min(28 / rectWidth, 28 / rectHeight);

    // Calculate offset to center the image
    const offsetX = (28 - rectWidth * scale) / 2;
    const offsetY = (28 - rectHeight * scale) / 2;

    // Draw the scaled image on the 28x28 canvas
    finalCtx.drawImage(tempCanvas, 0, 0, rectWidth, rectHeight, offsetX, offsetY, rectWidth * scale, rectHeight * scale);

    // drawn theimage on the canvas2 eleemnt
    const canvas2 = document.getElementById('canvas2') as HTMLCanvasElement;
    canvas2.width = 28
    canvas2.height = 28
    const ctx2 = canvas2.getContext('2d');
    if (!ctx2) return
    ctx2.drawImage(finalCanvas, 0, 0);

    // Return the final image as a base64 URL
    return finalCanvas.toDataURL();
  }
  function cleaCanvas(canvas: HTMLCanvasElement | null){
    if (!canvas) return
    ctx?.clearRect(0,0, canvas?.width, canvas?.height)
    isCanvasEmpty = true
  }

  // ----------------
  // Reactivity Stuff
  // ----------------
  $effect(()=>{
    if (!mouse_x || !mouse_y) return
    handleDraw(mouse_x,mouse_y)
  })
  // this effect block is used as a Initlize function (To avoid using onMount)
  $effect(init)
  function init() {
    resizeCanvasToParent()
    window.addEventListener('resize', resizeCanvasToParent)
    setEventHandlers()
  }

  // ----------------
  // Events Stuff
  // ----------------
  function setEventHandlers() {
    if (!canvas) return
    canvas.addEventListener('touchmove', (e)=>{
      e.preventDefault()
      if (!canvas) return
      let rect = canvas.getBoundingClientRect()
      mouse_x = e.touches[0].clientX - rect.left
      mouse_y = e.touches[0].clientY - rect.top
    },false)
  }
</script>


<div class="w-full flex flex-col items-center justify-center">
  <div class="w-full max-w-5xl" >
    <div class="artboard artboard-demo w-full overflow-hidden shadow-xl relative b-2 b-dashed b-blue-4/30">
      <p class="{isCanvasEmpty? '' : 'opacity-0'} select-nonex pointer-events-none transition-opacity text-blueGray font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"> - Draw Here - </p>
      <div aria-label="mouse-tracker" class=" { isDrawing ? 'shadow-sm': 'shadow-md scale-102'} transition duration-250 select-none absolute rounded-full b-3 pointer-events-none" style="left: {mouse_x-(lineWidth/2)}px; top: {mouse_y-(lineWidth/2)}px; width: {lineWidth}px; height: {lineWidth}px" ></div>
      <canvas height="500" width="1" class="touch-manipulation cursor-none outline-none" bind:this={canvas}
        tabindex="0"
        onmousemove={e=>{
          mouse_x = e.offsetX
          mouse_y = e.offsetY
        }}
        onmousedown={(e)=>{
          isDrawing = true;
          prevMouse_x = e.offsetX
          prevMouse_y = e.offsetY
          isCanvasEmpty = false
        }}
        onmouseup={(e)=>{
          isDrawing = false
          get28x28Image(canvas)
          if (eraseOnEachDraw){
            cleaCanvas(canvas)
          }
        }}
        ontouchstart={(e)=>{
          if (!canvas) return
          isCanvasEmpty = false
          isDrawing = true;
          let rect = canvas.getBoundingClientRect()
          prevMouse_x = e.touches[0].clientX - rect.left
          prevMouse_y = e.touches[0].clientY - rect.top
          mouse_x = e.touches[0].clientX - rect.left
          mouse_y = e.touches[0].clientY - rect.top
        }}
        ontouchend={(e)=>{
          isDrawing = false
          get28x28Image(canvas)
          if (eraseOnEachDraw){
            cleaCanvas(canvas)
          }
        }}
        onkeydown={(e)=>{
          if (e.key === 'Delete'){
            cleaCanvas(canvas)
          }
        }}
      >
      </canvas>
    </div>
    <div class="flex items-center px-4" >
      <button aria-label="clear-canvas"  class="btn"
        onclick={()=>{
          cleaCanvas(canvas)
        }}
      >
        <div class="i-tabler:trash size-5 text-red"></div>
      </button>
      <div class="dropdown dropdown-bottom">
        <div tabindex="0" role="button" class="btn m-1"> <div class="i-material-symbols:line-weight-rounded size-5"></div> </div>
        <div class="dropdown-content menu bg-base-200 rounded-box z-[1] w-60 shadow px-4 py-2" >
          <label>
            <div class="label">
              <span class="label-text">Weight <span class="badge" >px</span> </span>
            </div>
            <div class="flex place-items-center gap-4">
              <input type="range" bind:value={lineWidth} min="20" max="100" class="range max-w-40" />
              <input type="text" bind:value={lineWidth} style="padding-left: 0; padding-right: 0;" class=" input input-bordered w-full max-w-12 text-align-center " />
            </div>
          </label>
        </div>
      </div>
      <div class=" bg-base-200 h-12 grid place-items-center px-2 rounded-lg">
        <input type="checkbox" class="toggle" bind:checked={eraseOnEachDraw} />
      </div>
    </div>
  </div>
  <canvas id="canvas2" height="500" width="500" class="w-full max-w-100 aspect-square" ></canvas>
</div>
