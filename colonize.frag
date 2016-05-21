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
    float ps = 1./2048.;

    vec4 c = texture2D(uSampler, vTextureCoord);

    gl_FragColor = c;


    vec4 cu = texture2D(uSampler, vTextureCoord + vec2(0.,-ps));
    vec4 cd = texture2D(uSampler, vTextureCoord + vec2(0.,ps));
    vec4 cl = texture2D(uSampler, vTextureCoord + vec2(-ps,0.));
    vec4 cr = texture2D(uSampler, vTextureCoord + vec2(ps,0.));

    float totalDev = cu.g + cd.g  + cl.g + cr.g ;


    if(totalDev > .0 && totalDev > 1. - c.r - rand(vTextureCoord.xy*time)*0.75 +0.5) {

       gl_FragColor.b = max(max(cu.b,cd.b),max(cl.b,cr.b));
       gl_FragColor.g = 0.1;

    }





}