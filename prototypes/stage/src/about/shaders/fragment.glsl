varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    
    // Create square shape instead of circle
    vec2 center = vec2(0.5);
    vec2 dist = abs(uv - center);
    
    // Check if outside square bounds (0.5 radius = 1.0 width/height)
    if(dist.x > 0.5 || dist.y > 0.5)
        discard;

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}