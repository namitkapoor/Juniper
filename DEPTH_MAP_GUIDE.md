# Depth Map Creation Guide

## What Makes a Good Depth Map?

Your depth map determines how realistic the 3D parallax effect looks. Here's how to create or improve one:

### 1. **Depth Map Basics**
- **White (255)** = Closest to camera (foreground)
- **Black (0)** = Furthest from camera (background)
- **Gray (128)** = Middle distance

### 2. **Key Quality Factors**

#### ✅ Good Depth Map Characteristics:
- **Smooth gradients** between depth layers (no harsh edges)
- **High contrast** between foreground and background
- **Accurate edge detection** around the subject
- **Same dimensions** as the color photo
- **Clean, no noise** in the grayscale values

#### ❌ Common Issues Causing Distortion:
- Misaligned edges (depth map doesn't match photo perfectly)
- Too much contrast (pure white/black causes extreme displacement)
- Noisy/grainy depth values
- Wrong dimensions (must match color photo exactly)

### 3. **How to Create/Improve Your Depth Map**

#### Option A: Using AI Tools (Fastest)
1. **DepthAnything V2** (Best quality)
   - Visit: https://huggingface.co/spaces/depth-anything/Depth-Anything-V2
   - Upload your photo
   - Download the depth map

2. **Photoshop Neural Filters** (If you have CC)
   - Select → Subject
   - Neural Filters → Depth Blur
   - Extract the depth map layer

3. **iPhone Portrait Mode**
   - If your photo was taken in portrait mode
   - Use apps like "DepthLab" to extract the depth map

#### Option B: Manual Creation in Photoshop
1. Open your photo
2. Duplicate layer
3. **Select your face/body** (main subject)
   - Use Select → Subject (or manual selection)
   - Feather edges: 10-20px for smooth transitions
4. **Create depth layers:**
   ```
   Layer 1: Face/glasses (255 white) - Closest
   Layer 2: Hair/shoulders (200 gray) - Mid-close
   Layer 3: Body (150 gray) - Mid
   Layer 4: Background (0 black) - Farthest
   ```
5. **Blur between layers:**
   - Apply Gaussian Blur (5-10px) to each layer
   - Blend modes: Normal, 100% opacity
6. **Flatten and desaturate** (Image → Mode → Grayscale)

### 4. **Testing Your Depth Map**

Open both images side by side and check:
- [ ] Same dimensions (width × height)
- [ ] Subject edges align perfectly
- [ ] Smooth gradients (no banding)
- [ ] Good contrast (use Levels adjustment if needed)
- [ ] No artifacts or noise

### 5. **Quick Photoshop Depth Map Workflow**

```
1. Open photo
2. Select → Subject
3. Select → Modify → Feather (15px)
4. Create new layer filled with 50% gray
5. Fill selection with white
6. Gaussian Blur: 8-12px
7. Levels adjustment: increase contrast slightly
8. Save as PNG (same filename + " depth map")
```

### 6. **Optimizing Intensity Settings**

Current settings in the code:
- **intensity={15}** - Good for subtle, natural movement
- Increase to 20-25 for more dramatic effect
- Decrease to 8-12 for very subtle movement

### 7. **Troubleshooting Distortion**

If you see distortion:
1. **Reduce intensity** (try 10-12 first)
2. **Smooth your depth map** - Apply Gaussian blur in Photoshop
3. **Check alignment** - Edges must match perfectly
4. **Normalize values** - Use Levels to ensure full 0-255 range
5. **Test with simpler map** - Create a basic 3-layer map first

### 8. **Example Depth Map Values for Portrait**

For your photo with glasses:
```
Glasses/nose: 255 (white) - Closest
Face: 220 (light gray)
Ears/sides of face: 180 (mid gray)
Hair: 150 (darker gray)
Shoulders: 120 (dark gray)
Turtleneck: 100 (darker)
Background: 0 (black) - Farthest
```

### 9. **Advanced: AI-Based Depth Map Tools**

**Online Tools:**
- Depth Anything V2: https://huggingface.co/spaces/depth-anything/Depth-Anything-V2
- Marigold Depth: https://huggingface.co/spaces/prs-eth/marigold-depth-estimation
- ZoeDepth: https://huggingface.co/spaces/shariqfarooq/ZoeDepth

**Python (if you have it):**
```python
# Using depth-anything
pip install depth-anything-v2
python infer.py --img-path "Self photo.png" --outdir output
```

### 10. **Current Implementation Features**

The depth effect now includes:
- ✅ Bilinear interpolation (smoother displacement)
- ✅ Normalized depth values (-1 to 1 range)
- ✅ Edge clamping (prevents out-of-bounds)
- ✅ Reduced intensity (15 instead of 25)

This should significantly reduce distortion while maintaining the 3D effect!


