<script lang="ts">
  let canvas: HTMLCanvasElement | null = null;
  let mouse_x: number|null = $state(null);
  let mouse_y: number|null = $state(null);
  let prevMouse_x = 0;
  let prevMouse_y = 0;
  let ctx = $state<CanvasRenderingContext2D| null>()
  let lineWidth = $state(40)
  let isDrawing = false
  let isCanvasEmpty = $state(true)

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
      <div aria-label="mouse-tracker" class=" shadow-xl select-none absolute rounded-full b-3 pointer-events-none" style="left: {mouse_x-(lineWidth/2)}px; top: {mouse_y-(lineWidth/2)}px; width: {lineWidth}px; height: {lineWidth}px" ></div>
      <canvas height="500" width="1" class="touch-manipulation cursor-none" bind:this={canvas}
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
        }}
        ontouchstart={(e)=>{
          if (!canvas) return
          isCanvasEmpty = false
          isDrawing = true;
          let rect = canvas.getBoundingClientRect()
          prevMouse_x = e.touches[0].clientX - rect.left
          prevMouse_y = e.touches[0].clientY - rect.top
        }}
        ontouchend={(e)=>{
          isDrawing = false
        }}
      >
      </canvas>
    </div>
    <div class="flex items-center px-4" >
      <button class="btn" onclick={()=>{ctx?.clearRect(0,0, canvas?.width, canvas?.height), isCanvasEmpty = true}} > <div class="i-tabler:trash size-5 text-red"></div> </button>
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
    </div>
  </div>
</div>
