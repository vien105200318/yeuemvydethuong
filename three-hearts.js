// Three.js Scene Setup
let scene, camera, renderer, particleSystems = [];
let isIntensified = false;
let starField = null;

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;
    
    // Renderer
    const canvas = document.getElementById('threeCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create stars in the background
    createStarField();
    
    // Create ONE massive epic heart in the center
    createEpicCenterHeart();
    
    // Animation loop
    animate();
    
    // Resize handler
    window.addEventListener('resize', onWindowResize);
}

// Generate heart shape coordinates in 3D with more layers
function getHeartCoordinates(numPoints = 2000, depth = 10) {
    const points = [];
    
    // Create multiple layers for depth
    const layers = 15;
    const pointsPerLayer = Math.floor(numPoints / layers);
    
    for (let layer = 0; layer < layers; layer++) {
        const zOffset = (layer / layers - 0.5) * depth;
        
        for (let i = 0; i < pointsPerLayer; i++) {
            const t = (i / pointsPerLayer) * Math.PI * 2;
            
            // Parametric heart equation
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            
            // Add some randomness for organic look
            const randomOffset = 0.3;
            points.push({
                x: x + (Math.random() - 0.5) * randomOffset,
                y: y + (Math.random() - 0.5) * randomOffset,
                z: zOffset + (Math.random() - 0.5) * 2
            });
        }
    }
    
    return points;
}

// Create a beautiful star field in the background
function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starColors = [];
    const starSizes = [];
    
    // Create 1000 stars
    for (let i = 0; i < 1000; i++) {
        // Random position in a large sphere around the scene
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 100 + Math.random() * 100;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi) - 50; // Push back
        
        starPositions.push(x, y, z);
        
        // Pink/white star colors
        const colorChoice = Math.random();
        if (colorChoice > 0.7) {
            // Pink stars
            starColors.push(1.0, 0.7, 0.85);
        } else if (colorChoice > 0.4) {
            // Light pink stars
            starColors.push(1.0, 0.9, 0.95);
        } else {
            // White stars
            starColors.push(1.0, 1.0, 1.0);
        }
        
        // Random sizes
        starSizes.push(Math.random() * 2 + 0.5);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        map: createCircleTexture()
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    
    return starField;
}

// Create the epic center heart
function createEpicCenterHeart() {
    const heartPoints = getHeartCoordinates(8000, 15); // 8000 particles!
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    
    // Enhanced color palette with glow colors - SUPER BRIGHT!
    const colorPalette = [
        new THREE.Color(2.0, 0.3, 1.0),   // Ultra vibrant pink
        new THREE.Color(2.0, 0.2, 1.2),   // Ultra deep pink
        new THREE.Color(2.0, 0.6, 1.3),   // Ultra hot pink
        new THREE.Color(2.0, 0.8, 1.4),   // Ultra pink
        new THREE.Color(2.0, 1.2, 1.5),   // Ultra light pink
        new THREE.Color(2.0, 1.0, 1.4),   // Ultra light pink 2
        new THREE.Color(2.0, 0.1, 1.0),   // Ultra rose
        new THREE.Color(2.0, 0.5, 1.5)    // Ultra magenta pink
    ];
    
    heartPoints.forEach((point, index) => {
        positions.push(point.x, point.y, point.z);
        
        // Create gradient effect - brighter in center
        const distanceFromCenter = Math.sqrt(point.x * point.x + point.y * point.y) / 20;
        const colorIndex = Math.floor(distanceFromCenter * colorPalette.length);
        const color = colorPalette[Math.min(colorIndex, colorPalette.length - 1)];
        
        colors.push(color.r, color.g, color.b);
        
        // Variable sizes for depth perception - BIGGER!
        const size = Math.random() * 4 + 2;
        sizes.push(size);
    });
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Create material with enhanced glow - ULTRA BRIGHT!
    const material = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        map: createGlowTexture()
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    
    // Position at center
    particleSystem.position.set(0, 0, 0);
    
    // Scale up for epic size
    const scale = 2.0;
    particleSystem.scale.set(scale, scale, scale);
    
    // Custom properties for animation
    particleSystem.userData = {
        rotationSpeed: {
            x: 0,
            y: 0,
            z: 0
        },
        pulseSpeed: 0.0012,
        isEpic: true
    };
    
    scene.add(particleSystem);
    particleSystems.push(particleSystem);
    
    return particleSystem;
}

function createParticleHeart() {
    const heartPoints = getHeartCoordinates(2000);
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    
    // Color palette
    const colorPalette = [
        new THREE.Color(0xff1493), // Deep pink
        new THREE.Color(0xff69b4), // Hot pink
        new THREE.Color(0xff6b9d), // Pink
        new THREE.Color(0xffc0cb), // Light pink
        new THREE.Color(0xffb6c1)  // Light pink 2
    ];
    
    heartPoints.forEach(point => {
        positions.push(point.x, point.y, point.z);
        
        // Random color from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors.push(color.r, color.g, color.b);
        
        // Random size
        sizes.push(Math.random() * 2 + 1);
    });
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Create material with glow effect
    const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        map: createCircleTexture()
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    
    // Random position
    particleSystem.position.x = (Math.random() - 0.5) * 80;
    particleSystem.position.y = (Math.random() - 0.5) * 60;
    particleSystem.position.z = (Math.random() - 0.5) * 60;
    
    // Random rotation
    particleSystem.rotation.x = Math.random() * Math.PI;
    particleSystem.rotation.y = Math.random() * Math.PI;
    particleSystem.rotation.z = Math.random() * Math.PI;
    
    // Random scale
    const scale = Math.random() * 0.4 + 0.3;
    particleSystem.scale.set(scale, scale, scale);
    
    // Custom properties for animation
    particleSystem.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: Math.random() * 0.015 + 0.005,
        floatRange: Math.random() * 8 + 5,
        initialY: particleSystem.position.y,
        pulseSpeed: Math.random() * 0.001 + 0.0005
    };
    
    scene.add(particleSystem);
    particleSystems.push(particleSystem);
    
    return particleSystem;
}

// Create enhanced glow texture for particles - SUPER BRIGHT!
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Keep old function for compatibility
function createCircleTexture() {
    return createGlowTexture();
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now();
    
    // Animate star field - slow rotation and twinkle
    if (starField) {
        starField.rotation.y += 0.0001;
        starField.rotation.x += 0.00005;
        
        // Make stars twinkle
        const starSizes = starField.geometry.attributes.size.array;
        for (let i = 0; i < starSizes.length; i++) {
            const twinkle = Math.abs(Math.sin(time * 0.001 + i * 0.1));
            starSizes[i] = (0.5 + Math.random() * 2) * (0.5 + twinkle * 0.5);
        }
        starField.geometry.attributes.size.needsUpdate = true;
    }
    
    // Animate each particle heart
    particleSystems.forEach((system, systemIndex) => {
        // NO ROTATION - heart stays still
        
        // Epic pulsing scale - more dramatic
        const pulse = 1 + Math.sin(time * system.userData.pulseSpeed) * 0.15;
        const baseScale = system.userData.baseScale || (system.userData.isEpic ? 2.0 : 
            (system.scale.x / (1 + Math.sin((time - 16) * system.userData.pulseSpeed) * 0.15)));
        system.scale.set(baseScale * pulse, baseScale * pulse, baseScale * pulse);
        
        // Animate individual particles - FIREWORK EFFECT
        const positions = system.geometry.attributes.position.array;
        const sizes = system.geometry.attributes.size.array;
        const colors = system.geometry.attributes.color.array;
        
        for (let i = 0; i < sizes.length; i++) {
            // INTENSE twinkling like fireworks - BRIGHTER!
            const twinkle1 = Math.abs(Math.sin(time * 0.003 + i * 0.1));
            const twinkle2 = Math.abs(Math.cos(time * 0.005 + i * 0.08));
            const sparkle = Math.abs(Math.sin(time * 0.008 + i * 0.05));
            
            sizes[i] = (twinkle1 * twinkle2 + sparkle) * 6 + 3;
            
            // Firework glow pulsing - MAXIMUM BRIGHTNESS!
            if (system.userData.isEpic) {
                const glowPulse1 = Math.abs(Math.sin(time * 0.002 + i * 0.03)) * 0.5 + 0.5;
                const glowPulse2 = Math.abs(Math.cos(time * 0.0015 + i * 0.04)) * 0.5 + 0.5;
                const colorIntensity = (glowPulse1 * glowPulse2) * 1.5 + 0.8;
                
                colors[i * 3] = Math.min(colors[i * 3] * colorIntensity, 2.0);
                colors[i * 3 + 1] = Math.min(colors[i * 3 + 1] * colorIntensity, 2.0);
                colors[i * 3 + 2] = Math.min(colors[i * 3 + 2] * colorIntensity, 2.0);
            }
        }
        
        system.geometry.attributes.size.needsUpdate = true;
        system.geometry.attributes.color.needsUpdate = true;
    });
    
    // Camera stays still, only slight breathing motion
    camera.position.x = Math.sin(time * 0.0001) * 2;
    camera.position.y = Math.sin(time * 0.00008) * 2;
    camera.position.z = 60 + Math.sin(time * 0.0001) * 3;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to intensify hearts when "Yes" is clicked
function intensifyHearts() {
    if (isIntensified) return;
    isIntensified = true;
    
    // Make the ONE AND ONLY epic heart EXPLODE and GROW BIGGER!
    particleSystems.forEach(system => {
        if (system.userData.isEpic) {
            // Store original values
            const originalPulse = system.userData.pulseSpeed;
            const originalScale = 2.0;
            
            // GROW BIGGER PERMANENTLY!
            const newScale = 3.5;
            system.scale.set(newScale, newScale, newScale);
            system.userData.baseScale = newScale; // Store new base scale
            
            // FIREWORK EXPLOSION!
            system.userData.pulseSpeed *= 4;
            
            // MAXIMUM brightness and size
            system.material.opacity = 1.0;
            system.material.size = 3.5;
            
            // Create firework burst effect
            const positions = system.geometry.attributes.position.array;
            const sizes = system.geometry.attributes.size.array;
            const originalPositions = [...positions];
            
            let explosionProgress = 0;
            const explosionInterval = setInterval(() => {
                explosionProgress += 0.015;
                
                if (explosionProgress >= 1) {
                    clearInterval(explosionInterval);
                    // Restore pulse but KEEP THE BIG SIZE!
                    setTimeout(() => {
                        system.userData.pulseSpeed = originalPulse;
                        system.material.size = 3.0; // Keep it bigger
                        // Keep the scale at 3.5 - don't reduce!
                    }, 3000);
                    return;
                }
                
                // Multiple explosion waves
                const wave1 = Math.sin(explosionProgress * Math.PI * 2);
                const wave2 = Math.sin(explosionProgress * Math.PI * 3);
                const wave3 = Math.sin(explosionProgress * Math.PI * 4);
                
                for (let i = 0; i < positions.length; i += 3) {
                    const x = originalPositions[i];
                    const y = originalPositions[i + 1];
                    const z = originalPositions[i + 2];
                    
                    // Triple wave explosion
                    const distance = Math.sqrt(x * x + y * y + z * z);
                    const factor = 1 + (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.2);
                    
                    positions[i] = x * factor;
                    positions[i + 1] = y * factor;
                    positions[i + 2] = z * factor;
                    
                    // Size burst
                    sizes[i / 3] = 3 + Math.abs(wave1) * 4;
                }
                system.geometry.attributes.position.needsUpdate = true;
                system.geometry.attributes.size.needsUpdate = true;
            }, 50);
        }
    });
    
    // NO MORE ADDITIONAL HEARTS - Keep it simple and clean with just ONE heart
}

// Initialize when page loads
window.addEventListener('load', initThreeJS);

// Export for use in main script
window.intensifyHearts = intensifyHearts;
