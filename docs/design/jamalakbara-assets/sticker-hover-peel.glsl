precision mediump float;
/** @resolution */
uniform vec2 u_resolution;
/** @mouse */
uniform vec2 u_mouse;
/** @label Sticker artwork */
uniform sampler2D u_content;
/** @label Hover strength @default 1 @range 0, 1 */
uniform float u_strength;
/** @label Preview hover @default 0 @range 0, 1 */
uniform float u_preview;
vec4 artwork(vec2 uv) {
  return texture2D(u_content,uv)*step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 m=u_mouse/u_resolution;
  float edge=min(min(m.x,1.0-m.x),min(m.y,1.0-m.y));
  float hover=max(u_preview,smoothstep(0.0,0.18,edge))*u_strength;
  float curl=smoothstep(0.2,1.0,uv.x)*smoothstep(0.1,1.0,uv.y);
  vec2 q=uv;
  q.x+=hover*curl*0.035;
  q.y-=hover*curl*0.065;
  vec4 ink=artwork(q);
  float shade=0.0;
  for(int i=0;i<5;i++){
    float o=float(i)-2.0;
    shade+=artwork(uv+vec2(o*0.008,0.025+o*0.006)).a;
  }
  shade=shade*0.2*0.20*hover;
  ink.rgb*=1.0-0.07*hover*curl;
  gl_FragColor=ink+vec4(vec3(0.10,0.085,0.06)*shade,shade)*(1.0-ink.a);
}
