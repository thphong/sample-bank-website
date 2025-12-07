<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationId: number;

    interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
    }

    let particles: Particle[] = [];

    const NUM_PARTICLES = 70;
    const MAX_SPEED = 0.3;
    const LINK_DISTANCE = 180; // khoảng cách tối đa để vẽ line

    function resize() {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale theo dpr
        }
    }

    function initParticles() {
        particles = [];
        const w = canvas?.clientWidth ?? 0;
        const h = canvas?.clientHeight ?? 0;

        for (let i = 0; i < NUM_PARTICLES; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() * 2 - 1) * MAX_SPEED,
                vy: (Math.random() * 2 - 1) * MAX_SPEED,
            });
        }
    }

    function step() {
        if (!ctx || !canvas) return;

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        ctx.clearRect(0, 0, w, h);

        // move
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        // links
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < LINK_DISTANCE) {
                    const alpha = 1 - dist / LINK_DISTANCE;
                    ctx.strokeStyle = `rgba(0, 180, 255, ${0.35 * alpha})`; // xanh neon nhạt
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // particles
        for (const p of particles) {
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // glow nhẹ
            ctx.fillStyle = "rgba(0, 180, 255, 0.25)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        animationId = requestAnimationFrame(step);
    }

    function start() {
        resize();
        initParticles();
        step();
    }

    onMount(() => {
        start();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
        };
    });

    onDestroy(() => {
        cancelAnimationFrame(animationId);
    });
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<canvas bind:this={canvas} class="particles-canvas" />

<style>
    .particles-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
</style>
