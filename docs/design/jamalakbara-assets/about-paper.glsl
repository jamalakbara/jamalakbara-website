precision mediump float;
/** @resolution */
uniform vec2 u_resolution;
void main(){
 vec2 p=gl_FragCoord.xy;
 vec2 g=mod(p,32.0);
 float line=1.0-step(0.8,min(g.x,g.y));
 gl_FragColor=vec4(mix(vec3(0.973,0.965,0.941),vec3(0.903,0.878,0.824),line*0.35),1.0);
}
