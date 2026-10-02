// ============================================================================
// AEGIS ENDLESS - HIGH JUICE CANVAS PARTICLE EFFECTS SYSTEM
// ============================================================================

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.shockwaves = [];
    this.slashArcs = [];
    this.homingOrbs = [];
    this.coins = [];
    this.currentBiome = 'forest';
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  setBiome(biomeId) {
    this.currentBiome = biomeId || 'forest';
  }

  spawnAmbientParticles() {
    if (!this.canvas || Math.random() > 0.3) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    switch (this.currentBiome) {
      case 'forest':
        // Glowing fireflies / drifting spores
        this.particles.push({
          type: 'ambient_spore',
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.25 - Math.random() * 0.35,
          size: 1.5 + Math.random() * 2.0,
          color: Math.random() > 0.4 ? '#4ade80' : '#38bdf8',
          alpha: 0.85,
          decay: 0.006 + Math.random() * 0.006
        });
        break;
      case 'catacombs':
        // Water drip or dungeon dust
        if (Math.random() > 0.5) {
          this.particles.push({
            type: 'ambient_drip',
            x: Math.random() * w,
            y: 0,
            vx: (Math.random() - 0.5) * 0.2,
            vy: 1.2 + Math.random() * 1.8,
            gravity: 0.06,
            size: 1.5 + Math.random() * 1.5,
            color: '#38bdf8',
            alpha: 0.7,
            decay: 0.012
          });
        } else {
          this.particles.push({
            type: 'dust',
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: 1.2 + Math.random() * 1.2,
            color: '#94a3b8',
            alpha: 0.45,
            decay: 0.008
          });
        }
        break;
      case 'crag':
        // Rising fiery embers / cinders
        this.particles.push({
          type: 'ambient_ember',
          x: Math.random() * w,
          y: h - 5,
          vx: (Math.random() - 0.5) * 1.0,
          vy: -1.0 - Math.random() * 1.6,
          gravity: -0.015,
          size: 1.5 + Math.random() * 2.2,
          color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
          alpha: 1.0,
          decay: 0.012 + Math.random() * 0.012
        });
        break;
      case 'citadel':
        // Falling snowflakes / frost crystals
        this.particles.push({
          type: 'ambient_snow',
          x: Math.random() * w,
          y: 0,
          vx: 0.4 + (Math.random() - 0.5) * 0.6,
          vy: 0.6 + Math.random() * 1.0,
          size: 1.5 + Math.random() * 2.0,
          color: Math.random() > 0.3 ? '#e0f2fe' : '#7dd3fc',
          alpha: 0.85,
          decay: 0.007 + Math.random() * 0.005
        });
        break;
      case 'abyss':
        // Cosmic void motes / astral sparks
        this.particles.push({
          type: 'ambient_void',
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: 2.0 + Math.random() * 2.2,
          color: Math.random() > 0.4 ? '#c084fc' : '#a855f7',
          alpha: 0.9,
          decay: 0.009 + Math.random() * 0.009
        });
        break;
      case 'sanctum':
        // Golden divine sparkles
        this.particles.push({
          type: 'ambient_stardust',
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.3 - Math.random() * 0.4,
          size: 1.8 + Math.random() * 2.0,
          color: Math.random() > 0.5 ? '#fde047' : '#f59e0b',
          alpha: 0.95,
          decay: 0.01 + Math.random() * 0.008
        });
        break;
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth || 600;
    this.canvas.height = this.canvas.clientHeight || 200;
  }

  // 1. Kinetic Sparks / Shards with Gravity & Friction
  spawnSparks(x, y, color = '#fbbf24', count = 12, speedMult = 1.0) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2.0 + Math.random() * 5.0) * speedMult;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 1.5),
        gravity: 0.12,
        friction: 0.96,
        size: 1.5 + Math.random() * 2.5,
        color,
        alpha: 1.0,
        decay: 0.025 + Math.random() * 0.035
      });
    }
  }

  // 2. Critical Hit Diamond Shards Burst
  spawnCritShards(x, y, count = 16) {
    const palette = ['#fbbf24', '#f59e0b', '#ffffff', '#ef4444', '#fde047'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 6.5;
      this.particles.push({
        type: 'crit_diamond',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        gravity: 0.16,
        friction: 0.94,
        size: 3.0 + Math.random() * 3.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.025
      });
    }
  }

  // 3. Directional Incandescent Blade Slash Arcs
  spawnSlashArc(x, y, isCrit = false, angleDeg = 35) {
    const baseAngle = (angleDeg * Math.PI) / 180;
    this.slashArcs.push({
      x,
      y,
      radius: isCrit ? 48 : 34,
      startAngle: baseAngle - 0.9,
      endAngle: baseAngle + 0.9,
      width: isCrit ? 6 : 3.5,
      color: isCrit ? '#fbbf24' : '#e0e7ff',
      glowColor: isCrit ? '#ef4444' : '#60a5fa',
      alpha: 1.0,
      decay: isCrit ? 0.07 : 0.11,
      scaleProgress: 0.6
    });

    if (isCrit) {
      // Add cross slash
      const crossAngle = ((-angleDeg) * Math.PI) / 180;
      this.slashArcs.push({
        x,
        y,
        radius: 42,
        startAngle: crossAngle - 0.8,
        endAngle: crossAngle + 0.8,
        width: 4.5,
        color: '#ffffff',
        glowColor: '#f59e0b',
        alpha: 1.0,
        decay: 0.08,
        scaleProgress: 0.5
      });
    }
  }

  // 4. Expanding Shockwave Pressure Rings
  spawnShockwave(x, y, color = '#fbbf24', maxRadius = 55, duration = 0.3) {
    this.shockwaves.push({
      x,
      y,
      radius: 6,
      maxRadius,
      width: 4,
      color,
      alpha: 1.0,
      decay: 1.0 / (duration * 60)
    });
  }

  // 5. Gold Coin Fountain Burst on Kill
  spawnCoinFountain(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const spreadX = (Math.random() - 0.5) * 4.5;
      const jumpY = -3.5 - Math.random() * 4.5;
      this.coins.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 10,
        vx: spreadX,
        vy: jumpY,
        gravity: 0.22,
        size: 5,
        spinPhase: Math.random() * Math.PI * 2,
        spinSpeed: 0.2 + Math.random() * 0.2,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.01,
        bounceCount: 0
      });
    }
  }

  // 6. March Step Dust Puffs
  spawnStepDust(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'dust',
        x: x + (Math.random() - 0.5) * 12,
        y: y + 8 + (Math.random() - 0.5) * 4,
        vx: -0.8 - Math.random() * 1.4,
        vy: -0.2 - Math.random() * 0.6,
        gravity: -0.02,
        friction: 0.92,
        size: 3 + Math.random() * 4,
        color: '#64748b',
        alpha: 0.7,
        decay: 0.035 + Math.random() * 0.03
      });
    }
  }

  // 7. Life Leech Crimson Homing Energy Orbs
  spawnLifeLeech(fromX, fromY, toX, toY, count = 5) {
    for (let i = 0; i < count; i++) {
      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterDist = 10 + Math.random() * 25;
      this.homingOrbs.push({
        x: fromX + Math.cos(scatterAngle) * scatterDist,
        y: fromY + Math.sin(scatterAngle) * scatterDist,
        targetX: toX,
        targetY: toY,
        vx: (Math.random() - 0.5) * 4,
        vy: -2 - Math.random() * 3,
        color: '#ef4444',
        glowColor: '#f43f5e',
        trail: [],
        alpha: 1.0,
        speed: 4 + Math.random() * 3,
        age: 0,
        maxAge: 45
      });
    }
  }

  // 8. Venom Nova 360-degree needle burst
  spawnNovaWave(x, y, color = '#10b981', count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 4.0 + Math.random() * 2.0;
      this.particles.push({
        type: 'needle',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0,
        friction: 0.97,
        size: 2.5,
        color,
        alpha: 1.0,
        decay: 0.03 + Math.random() * 0.02
      });
    }
    this.spawnShockwave(x, y, '#10b981', 65, 0.4);
  }

  // 9. Iron Bastion Hex Shield Lattice
  spawnShieldBurst(x, y) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 32;
      this.particles.push({
        type: 'shield_rune',
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: Math.cos(angle) * 0.8,
        vy: Math.sin(angle) * 0.8,
        gravity: 0,
        friction: 0.95,
        size: 4,
        color: '#38bdf8',
        alpha: 1.0,
        decay: 0.025
      });
    }
    this.spawnShockwave(x, y, '#38bdf8', 45, 0.35);
  }

  // 10. Poison Bubbles
  spawnPoisonBubbles(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'bubble',
        x: x + (Math.random() - 0.5) * 32,
        y: y + (Math.random() - 0.5) * 24,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -1.2 - Math.random() * 2.2,
        gravity: -0.04,
        friction: 0.98,
        size: 2 + Math.random() * 3.5,
        color: '#10b981',
        alpha: 0.9,
        decay: 0.025 + Math.random() * 0.03
      });
    }
  }

  // 11. Blood / Acid Splatter Droplets
  spawnBloodSplatter(x, y, count = 10, isAcid = false) {
    const color = isAcid ? '#84cc16' : '#dc2626';
    for (let i = 0; i < count; i++) {
      const angle = Math.PI * (0.8 + Math.random() * 0.4); // upward/outward arc
      const speed = 2.0 + Math.random() * 4.5;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - 2.0,
        gravity: 0.2,
        friction: 0.96,
        size: 2 + Math.random() * 2,
        color,
        alpha: 1.0,
        decay: 0.03 + Math.random() * 0.03
      });
    }
  }

  // Main Render Loop (Executed at 60 FPS)
  updateAndDraw() {
    if (!this.ctx || !this.canvas) return;
    if (this.canvas.clientWidth && (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight)) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Spawn ambient atmosphere particles for current location
    this.spawnAmbientParticles();

    // --- 1. RENDER SHOCKWAVES ---
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.18 + 0.5;
      sw.alpha -= sw.decay;

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, sw.alpha);
      this.ctx.strokeStyle = sw.color;
      this.ctx.lineWidth = Math.max(1, sw.width * sw.alpha);
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = sw.color;
      this.ctx.beginPath();
      this.ctx.ellipse(sw.x, sw.y, sw.radius, sw.radius * 0.65, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // --- 2. RENDER SLASH ARCS ---
    for (let i = this.slashArcs.length - 1; i >= 0; i--) {
      const arc = this.slashArcs[i];
      arc.alpha -= arc.decay;
      arc.scaleProgress += 0.08;

      if (arc.alpha <= 0) {
        this.slashArcs.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, arc.alpha);
      this.ctx.strokeStyle = arc.color;
      this.ctx.lineWidth = arc.width * arc.alpha;
      this.ctx.lineCap = 'round';
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = arc.glowColor;
      this.ctx.beginPath();
      this.ctx.arc(arc.x, arc.y, arc.radius * Math.min(1.2, arc.scaleProgress), arc.startAngle, arc.endAngle);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // --- 3. RENDER COINS ---
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.vy += coin.gravity;
      coin.x += coin.vx;
      coin.y += coin.vy;
      coin.spinPhase += coin.spinSpeed;
      coin.alpha -= coin.decay;

      // Ground bounce check
      const groundY = (this.canvas.height * 0.75);
      if (coin.y >= groundY && coin.vy > 0 && coin.bounceCount < 2) {
        coin.y = groundY;
        coin.vy = -coin.vy * 0.45;
        coin.vx *= 0.6;
        coin.bounceCount += 1;
      }

      if (coin.alpha <= 0) {
        this.coins.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, coin.alpha);
      const widthScale = Math.abs(Math.cos(coin.spinPhase));
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = '#fbbf24';
      this.ctx.fillRect(coin.x - (coin.size * widthScale) / 2, coin.y - coin.size / 2, Math.max(1, coin.size * widthScale), coin.size);
      // Sparkle center
      this.ctx.fillStyle = '#fef08a';
      this.ctx.fillRect(coin.x - (coin.size * 0.4 * widthScale) / 2, coin.y - (coin.size * 0.4) / 2, Math.max(1, coin.size * 0.4 * widthScale), coin.size * 0.4);
      this.ctx.restore();
    }

    // --- 4. RENDER HOMING LEECH ORBS ---
    for (let i = this.homingOrbs.length - 1; i >= 0; i--) {
      const orb = this.homingOrbs[i];
      orb.age++;

      // Track trail
      orb.trail.push({ x: orb.x, y: orb.y, alpha: orb.alpha });
      if (orb.trail.length > 5) orb.trail.shift();

      // Steering physics toward target
      const dx = orb.targetX - orb.x;
      const dy = orb.targetY - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 15 || orb.age > orb.maxAge) {
        // Hit target: mini burst
        this.spawnSparks(orb.x, orb.y, '#38bdf8', 3, 0.6);
        this.homingOrbs.splice(i, 1);
        continue;
      }

      const steer = 0.18;
      orb.vx += (dx / dist) * orb.speed * steer;
      orb.vy += (dy / dist) * orb.speed * steer;
      orb.vx *= 0.9;
      orb.vy *= 0.9;

      orb.x += orb.vx;
      orb.y += orb.vy;

      this.ctx.save();
      // Draw tail trail
      for (let t = 0; t < orb.trail.length; t++) {
        const pt = orb.trail[t];
        const tAlpha = (t / orb.trail.length) * 0.6;
        this.ctx.globalAlpha = tAlpha;
        this.ctx.fillStyle = orb.glowColor;
        this.ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
      }

      // Draw Orb head
      this.ctx.globalAlpha = 1.0;
      this.ctx.fillStyle = orb.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = orb.glowColor;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, 3.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // --- 5. RENDER GENERAL PARTICLES (Sparks, Crit Diamonds, Dust, Needles, Bubbles) ---
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.friction) {
        p.vx *= p.friction;
        p.vy *= p.friction;
      }
      if (p.gravity) {
        p.vy += p.gravity;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'crit_diamond') {
        p.rotation += p.rotSpeed;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size);
        this.ctx.lineTo(p.size * 0.7, 0);
        this.ctx.lineTo(0, p.size);
        this.ctx.lineTo(-p.size * 0.7, 0);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (p.type === 'shield_rune') {
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else if (p.type === 'needle') {
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
        this.ctx.stroke();
      } else if (p.type === 'dust') {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Standard spark / bubble
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}

