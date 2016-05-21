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


float rand(vec2 v)
{
    return fract(sin(dot(v.xy,vec2(33.9898,78.233))) * (time+43758.5453));
}


void main( void )
{
   float ps = 1./2048.;



    vec4 oc = texture2D(uSampler, vTextureCoord);

   // gl_FragColor = c; return;

    vec4 c = vec4(0.);



    if (oc.b> 0. ) {
        if (int(oc.b*255.+.5) == 1) {
            c = vec4(1.,1.,0.,0.);
        }
        if (int(oc.b*255.+.5) == 2) {
            c = vec4(0.,1.,1.,0.);
        }
        if (int(oc.b*255.+.5) == 3) {
            c = vec4(1.,0.,1.,0.);
        }
        if (int(oc.b*255.+.5) == 4) {
            c = vec4(0.,1.,0.,0.);
        }
        if (int(oc.b*255.+.5) == 5) {
            c = vec4(0.,0.,1.,0.);
        }
        if (int(oc.b*255.+.5) == 6) {
            c = vec4(1.,0.,0.,0.);
        }
        if (int(oc.b*255.+.5) == 7) {
            c = vec4(0.5,1.,0.,0.);
        }
        if (int(oc.b*255.+.5) == 8) {
            c = vec4(0.,1.,0.5,0.);
        }
        if (int(oc.b*255.+.5) == 9) {
            c = vec4(0.,0.5,1.,0.);
        }

        c.a=0.1;
    }
    gl_FragColor = c;

    vec4 cu = texture2D(uSampler, vTextureCoord + vec2(0.,ps));
    vec4 cd = texture2D(uSampler, vTextureCoord + vec2(0.,-ps));
    vec4 cl = texture2D(uSampler, vTextureCoord + vec2(ps,0.));
    vec4 cr = texture2D(uSampler, vTextureCoord + vec2(-ps,0.));


   if (cu.b != oc.b || cd.b != oc.b || cl.b != oc.b || cr.b != oc.b  ) {
      c.a=0.3;
   }

    gl_FragColor = c;
}