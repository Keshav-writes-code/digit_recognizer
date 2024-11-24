<script lang="ts">
  let canvas: HTMLCanvasElement | null = null;

  let mouse_x: number|null = $state(null);
  let mouse_y: number|null = $state(null);
  let prevMouse_x = 0;
  let prevMouse_y = 0;
  let ctx = $state<CanvasRenderingContext2D| null>()

  $effect(()=>{
    ctx = canvas?.getContext('2d')
    if (!ctx || !mouse_x || !mouse_y) return
    ctx.lineWidth = 30
    ctx.lineCap="round";
    ctx.beginPath()
    ctx.moveTo(prevMouse_x,prevMouse_y);
    ctx.lineTo(mouse_x, mouse_y)
    ctx.strokeStyle = "white"
    ctx.stroke()
    prevMouse_x = mouse_x
    prevMouse_y = mouse_y
  })

  function handleMouseMove(e: MouseEvent){
    mouse_x = e.offsetX
    mouse_y = e.offsetY
  }
</script>

<canvas height="100" width="" class=" " bind:this={canvas} onmousemove={handleMouseMove} ></canvas>
<button class="btn" onclick={()=>{ctx?.clearRect(0,0, canvas?.width, canvas?.height)}} >Clear</button>