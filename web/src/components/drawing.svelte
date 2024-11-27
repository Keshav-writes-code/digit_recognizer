<script lang="ts">
  // this effect block is used as a Initlize function (To avoid using onMount)
  $effect(init)
  function init() {
    resizeCanvasToParent(100,100)
  }
  function resizeCanvasToParent() {
    if (!canvas) return
    canvas.width = canvas.parentElement?.offsetWidth
    canvas.height = canvas.parentElement?.offsetHeight
  }
  
  let canvas: HTMLCanvasElement | null = null;
  let mouse_x: number|null = $state(null);
  let mouse_y: number|null = $state(null);
  let prevMouse_x = 0;
  let prevMouse_y = 0;
  let ctx = $state<CanvasRenderingContext2D| null>()
  let lineWidth = $state(40)
  let isDrawing = false

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
  
  $effect(()=>{
    if (!mouse_x || !mouse_y) return
    handleDraw(mouse_x,mouse_y)
  })
</script>


<div class="">
  <div class="artboard artboard-demo lt-sm:artboard-horizontal phone-5">
    <canvas height="400" width="1090" class=" touch-manipulation" bind:this={canvas}
      onmousemove={e=>{
        mouse_x = e.offsetX
        mouse_y = e.offsetY
      }}
      onmousedown={(e)=>{
        isDrawing = true;
        prevMouse_x = e.offsetX
        prevMouse_y = e.offsetY
      }}
      onmouseup={(e)=>{
        isDrawing = false
      }}
    >
    </canvas>
  </div>
  <div class="flex items-center" >
    <button class="btn" onclick={()=>{ctx?.clearRect(0,0, canvas?.width, canvas?.height)}} > <div class="i-tabler:trash size-5"></div> </button>
    <div class="dropdown dropdown-bottom">
      <div tabindex="0" role="button" class="btn m-1"> <div class="i-material-symbols:line-weight-rounded size-5"></div> </div>
      <div class="dropdown-content menu bg-base-200 rounded-box z-[1] w-60 shadow" style="padding: 1rem; padding-top: 0.5rem;" >
        <label class="">
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
