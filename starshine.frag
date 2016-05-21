precision mediump float;
// utter random sketch noise thing improv.
// click to orbit camera
// @mmalex

uniform float     time;
uniform vec2      resolution;
uniform vec2      mouse;
uniform sampler2D  uSampler;
uniform vec2 spritePosition;


varying vec2 vTextureCoord;
varying vec4 vColor;


highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = time;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}


void main( void )
{
    vec4 c = texture2D(uSampler, vTextureCoord);
    vec4 c1 = texture2D(uSampler, vTextureCoord+vec2(0.,1./resolution.y));
    vec4 c2 = texture2D(uSampler, vTextureCoord+vec2(1./resolution.x,0.));
    vec4 c3 = texture2D(uSampler, vTextureCoord+vec2(0.,-1./resolution.y));
    vec4 c4 = texture2D(uSampler, vTextureCoord+vec2(-1./resolution.x,0.));

    gl_FragColor = c ;
    float r1 = rand(c1.xy);
    float r2 = rand(c2.xy);
    float r3 = rand(c3.xy);
    float r4 = rand(c4.xy);
    if (r1>0.5 || r2>0.5 || r3>0.5 || r4> 0.5) {
        gl_FragColor = gl_FragColor *(1.1) ;
    }


}