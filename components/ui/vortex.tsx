import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

interface VortexProps {
    children?: any;
    className?: string;
    containerClassName?: string;
    particleCount?: number;
    rangeY?: number;
    baseHue?: number;
    baseSpeed?: number;
    rangeSpeed?: number;
    baseRadius?: number;
    rangeRadius?: number;
    backgroundColor?: string;
    variant?: "default" | "singularity" | "neural-web" | "concentric-circles" | "sine-wave" | "water-ripple";
}

export const Vortex = (props: VortexProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef(null);
    const animationFrameId = useRef<number>(0);
    const noise3DRef = useRef(createNoise3D(Math.random));
    const particleCount = props.particleCount || 700;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = props.rangeY || 100;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed = props.baseSpeed || 0.0;
    const rangeSpeed = props.rangeSpeed || 1.5;
    const baseRadius = props.baseRadius || 1;
    const rangeRadius = props.rangeRadius || 2;
    const baseHue = props.baseHue || 220;
    const rangeHue = 100;
    const noiseSteps = 3;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;
    const backgroundColor = props.backgroundColor || "#000000";
    let tick = 0;
    let particleProps = new Float32Array(particlePropsLength);
    let center: [number, number] = [0, 0];

    const HALF_PI: number = 0.5 * Math.PI;
    const TAU: number = 2 * Math.PI;
    const TO_RAD: number = Math.PI / 180;
    const rand = (n: number): number => n * Math.random();
    const randRange = (n: number): number => n - rand(2 * n);
    const fadeInOut = (t: number, m: number): number => {
        let hm = 0.5 * m;
        return Math.abs(((t + hm) % m) - hm) / hm;
    };
    const lerp = (n1: number, n2: number, speed: number): number =>
        (1 - speed) * n1 + speed * n2;

    const setup = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
            const ctx = canvas.getContext("2d");

            if (ctx) {
                resize(canvas, ctx);
                initParticles();
                draw(canvas, ctx);
            }
        }
    };

    const initParticles = () => {
        tick = 0;
        particleProps = new Float32Array(particlePropsLength);

        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            initParticle(i);
        }
    };

    const initParticle = (i: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let x, y, vx, vy, life, ttl, speed, radius, hue;

        x = rand(canvas.width);
        y = center[1] + randRange(rangeY);
        vx = 0;
        vy = 0;
        life = 0;
        ttl = baseTTL + rand(rangeTTL);
        speed = baseSpeed + rand(rangeSpeed);
        radius = baseRadius + rand(rangeRadius);
        hue = baseHue + rand(rangeHue);

        particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    };

    const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        tick++;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawParticles(ctx);
        renderGlow(canvas, ctx);
        renderToScreen(canvas, ctx);

        animationFrameId.current = window.requestAnimationFrame(() =>
            draw(canvas, ctx),
        );
    };

    const drawParticles = (ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            updateParticle(i, ctx);
        }
    };

    const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let i2 = 1 + i,
            i3 = 2 + i,
            i4 = 3 + i,
            i5 = 4 + i,
            i6 = 5 + i,
            i7 = 6 + i,
            i8 = 7 + i,
            i9 = 8 + i;
        let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

        x = particleProps[i];
        y = particleProps[i2];

        if (props.variant === "singularity") {
            const dx = x - center[0];
            const dy = y - center[1];
            // Calculate angle from center
            const angleToCenter = Math.atan2(dy, dx);
            // Tangent angle (for rotation) + slight inward pull
            const spiralAngle = angleToCenter + Math.PI / 2 + 0.2;

            // Get noise value
            const noise = noise3DRef.current(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;

            // Blend noise and spiral (mostly spiral, some noise)
            n = spiralAngle + noise * 0.1;
        } else if (props.variant === "neural-web") {
            // Get base noise
            const noise = noise3DRef.current(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;

            // Quantize the angle to 4 cardinal directions (0, 90, 180, 270 degrees)
            // This creates the "circuit board" / grid movement
            const snapAngle = Math.round(noise / (Math.PI / 2)) * (Math.PI / 2);

            // Add a tiny bit of original noise back so it's not perfectly robotic
            n = snapAngle + (noise * 0.1);
        } else if (props.variant === "concentric-circles") {
            const dx = x - center[0];
            const dy = y - center[1];
            // Calculate angle from center
            const angleToCenter = Math.atan2(dy, dx);

            // Tangent angle = angleToCenter + 90 degrees (PI/2)
            // This forces particles to move perpendicular to the radius, creating a circle
            const tangentAngle = angleToCenter + Math.PI / 2;

            // Add very slight noise for organic variation, or keep it 0 for perfect circles
            const noise = noise3DRef.current(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;

            n = tangentAngle + (noise * 0.05);
        } else if (props.variant === "sine-wave") {
            // Create a flowing sine wave pattern
            // Increased frequency (0.004) and amplitude (1.5) for more visible waves
            // Changed + tick to - tick so the wave travels Left -> Right
            const wave = Math.sin(x * 0.004 - tick * 0.005) * 1.5;

            // Reduced noise (0.1) for cleaner lines
            const noise = noise3DRef.current(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;

            // Base flow is to the right (0 radians) + wave angle + slight noise
            n = wave + (noise * 0.1);
        } else if (props.variant === "water-ripple") {
            // Water Ripple Physics:
            // Waves travel outwards from center: sin(distance * k - t * w)
            const dx = x - center[0];
            const dy = y - center[1];
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Wave parameters
            const freq = 0.01;
            const speed = 0.015;

            // Calculate wave height based on radial distance
            const wave = Math.sin(distance * freq - tick * speed) * 2;

            // Add slight noise
            const noise = noise3DRef.current(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;

            n = wave + (noise * 0.1);
        } else {
            n = noise3DRef.current(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
        }

        if (props.variant === "sine-wave") {
            // Transverse Wave Physics:
            // Particles move ONLY up and down (vy), while the wave travels left-to-right.
            // y = sin(kx - wt) -> vy = d/dt(y) = -w * cos(kx - wt)

            const freq = 0.004;
            const speedFactor = 0.005;

            // vx is 0 (no horizontal movement for particles)
            vx = 0;

            // vy oscillates based on the wave derivative
            // We add a bit of noise to x to make it look less like a rigid grid
            vy = Math.cos(x * freq - tick * speedFactor) * 2;

            // Bypass lerp for immediate physics response
            particleProps[i3] = vx;
            particleProps[i4] = vy;
        } else if (props.variant === "water-ripple") {
            // Water Ripple Physics:
            // Particles move ONLY up and down (vy), while the wave travels radially.

            const dx = x - center[0];
            const dy = y - center[1];
            const distance = Math.sqrt(dx * dx + dy * dy);

            const freq = 0.01;
            const speed = 0.015;

            // vx is 0 (no horizontal movement)
            vx = 0;

            // vy oscillates based on the radial wave function
            // Amplitude decays slightly with distance to mimic real ripples? Maybe keep it constant for style.
            vy = Math.cos(distance * freq - tick * speed) * 2;

            particleProps[i3] = vx;
            particleProps[i4] = vy;
        } else {
            vx = lerp(particleProps[i3], Math.cos(n), 0.5);
            vy = lerp(particleProps[i4], Math.sin(n), 0.5);
        }

        life = particleProps[i5];
        ttl = particleProps[i6];
        speed = particleProps[i7];
        x2 = x + vx * speed; // speed prop acts as a multiplier here
        y2 = y + vy * speed;
        radius = particleProps[i8];
        hue = particleProps[i9];

        drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

        life++;

        particleProps[i] = x2;
        particleProps[i2] = y2;
        particleProps[i3] = vx;
        particleProps[i4] = vy;
        particleProps[i5] = life;

        (checkBounds(x, y, canvas) || life > ttl) && initParticle(i);
    };

    const drawParticle = (
        x: number,
        y: number,
        x2: number,
        y2: number,
        life: number,
        ttl: number,
        radius: number,
        hue: number,
        ctx: CanvasRenderingContext2D,
    ) => {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineWidth = radius;
        ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
        return x > canvas.width || x < 0 || y > canvas.height || y < 0;
    };

    const resize = (
        canvas: HTMLCanvasElement,
        ctx?: CanvasRenderingContext2D,
    ) => {
        const { innerWidth, innerHeight } = window;

        canvas.width = innerWidth;
        canvas.height = innerHeight;

        center[0] = 0.5 * canvas.width;
        center[1] = 0.5 * canvas.height;
    };

    const renderGlow = (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
    ) => {
        ctx.save();
        ctx.filter = "blur(8px) brightness(200%)";
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.filter = "blur(4px) brightness(200%)";
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
    };

    const renderToScreen = (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
    ) => {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
    };

    const handleResize = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
            resize(canvas, ctx);
        }
    };

    useEffect(() => {
        setup();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <div className={cn("relative h-full w-full", props.containerClassName)}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                ref={containerRef}
                className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
            >
                <canvas ref={canvasRef}></canvas>
            </motion.div>

            <div className={cn("relative z-10", props.className)}>
                {props.children}
            </div>
        </div>
    );
};
