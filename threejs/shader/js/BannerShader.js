/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Sepia tone shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

THREE.BannerShader = {

	uniforms : {
		time:       { value: 1.0 },
		_modifier:       { value: 1.0 },
		resolution: { value: new THREE.Vector2() },
		_mousePos: { value: new THREE.Vector2() },
		_noiseTexture: { type: "t"},
		_pongTexture: { type: "t" },
		_screenTexture: { type: "t"}
	},


	vertexShader: [

		"varying vec2 glTexCoord;",

		"void main()	{",
			"glTexCoord = uv;",
			"gl_Position = vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec2 resolution;",

		"uniform vec2 _mousePos;",

		"uniform float time;",
		"uniform sampler2D _noiseTexture;",
		"uniform sampler2D _screenTexture;",
		"uniform sampler2D _pongTexture;",

		"uniform float _modifier;",

		"varying vec2 glTexCoord;",

		"void main()	{",
		  "vec4 c;",

		  "float _timeModifier = 1.0;",
		  "float _newModifier = _modifier;",


		  "vec2 texel = glTexCoord;",

		  "texel.x = texel.x / resolution.y;",
		  "texel.x *= resolution.x;",


		  "vec2 strectMouse = _mousePos;",

		  "strectMouse.x = _mousePos.x / resolution.y;",
		  "strectMouse.x *= resolution.x;",

		  "float dist = distance(texel, strectMouse);",
		  "if (dist < 0.18) {",
		    "_newModifier = (1.0 - (dist / 0.18)) * 4.0;",
		    // gl_FragColor = vec4(1,0,0,1);
		    // return;
		    //_timeModifier = (1 - (dist / 0.18	)) *2;
		    //return float4(1, 1, 1, 1);
		  "}",

		  "float x = mod(fract(time * _timeModifier / 51.0), 0.45);",
		  "float y = mod(fract(time * _timeModifier / 237.0), 0.63);",

		  "vec2 coord = vec2(300.0 / 512.0, 200.0 / 512.0) * glTexCoord + vec2(x, y);",

		  "coord = clamp(coord, vec2(0, 0), vec2(1, 1));",

		  "vec4 noiseTexel = texture2D(_noiseTexture, coord);",
		  "vec2 offset = vec2(noiseTexel.b, noiseTexel.a) - vec2(0.5, 0.5);",

		  "vec2 txt_coords = glTexCoord - offset * _newModifier / 1000.0;", //0.18 is jitter value

		  "c = texture2D(_screenTexture, txt_coords);",



		  "vec4 origColor = texture2D(_pongTexture, txt_coords);",

		  "if (origColor.a > 0.5){",
		    "if (origColor.b < 0.6) {",
		      "c = origColor;",
		    "}",
		    "else {",
		      "c = texture2D(_pongTexture, glTexCoord);",
		    "}",
		  "}",

		  "if(c[3] == 0.0){",
		    "c = vec4(0, 0.34901960784, 0.75686274509, 1);",
		  "}",




		  "gl_FragColor = c;",
		"}"

	].join( "\n" )

};
