uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
uniform float uImageAspect;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    // Displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

    vec3 displacement = vec3(
        cos(aAngle) * 0.2,
        sin(aAngle) * 0.2,
        1.0
    );
    displacement = normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    
    newPosition += displacement;

    // Adjust position based on aspect ratio
    float screenAspect = uResolution.x / uResolution.y;
    if (screenAspect > uImageAspect) {
        // Screen is wider than image
        newPosition.x *= uImageAspect / screenAspect;
    } else {
        // Screen is taller than image
        newPosition.y *= screenAspect / uImageAspect;
    }

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture
    vec2 adjustedUV = uv;
    if (screenAspect > uImageAspect) {
        // Screen is wider than image
        adjustedUV.x = (uv.x - 0.5) * (screenAspect / uImageAspect) + 0.5;
    } else {
        // Screen is taller than image
        adjustedUV.y = (uv.y - 0.5) * (uImageAspect / screenAspect) + 0.5;
    }
    float pictureIntensity = texture(uPictureTexture, adjustedUV).r;

    // Point size
    gl_PointSize = 0.1 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings - keep pixels light/white
    vColor = vec3(pow(pictureIntensity, 2.0));
}