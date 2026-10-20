// The Sherpa, the game's built-in guide, as a friendly cartoon: knitted wool hat with
// ear flaps and a pom-pom, goggles pushed up, an orange down jacket. He pops up beside
// the answer panel, talks for a moment, blinks, and either waves (you got it) or tilts
// his head with a raised brow (have another look). Drawn about 120 x 130 in its own units.
// All motion is CSS (styles.css, "Sherpa"), so Reduce motion (body.calm) stills him.
export function Sherpa({ mood = 'happy' }) {
  const wave = mood === 'happy' || mood === 'hello'
  return (
    <svg className={`sherpa-guy mood-${mood}`} viewBox="0 0 120 130" aria-hidden="true">
      <defs>
        <linearGradient id="sh-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DDA574" /><stop offset="1" stopColor="#B7784A" /></linearGradient>
        <linearGradient id="sh-coat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F58D45" /><stop offset="1" stopColor="#C8521E" /></linearGradient>
        <linearGradient id="sh-hat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D8434B" /><stop offset="1" stopColor="#A82731" /></linearGradient>
        <radialGradient id="sh-lens" cx=".35" cy=".35" r=".8"><stop offset="0" stopColor="#FFE29A" /><stop offset="1" stopColor="#E08A12" /></radialGradient>
      </defs>
      <g className="sh-breathe">
        {/* down jacket, quilted, with a blue fleece collar */}
        <path d="M16 130 C16 105, 33 94, 60 94 C87 94, 104 105, 104 130 Z" fill="url(#sh-coat)" />
        <g stroke="#B04817" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7">
          <path d="M22 112 C40 108, 80 108, 98 112" /><path d="M18 124 C40 120, 80 120, 102 124" />
        </g>
        <path d="M60 99 L60 130" stroke="#7A2E0E" strokeWidth="2" />
        <path d="M42 95 C48 102, 72 102, 78 95 L76 89 C70 94, 50 94, 44 89 Z" fill="#2E5E8C" />
        {/* left arm resting */}
        <path d="M24 108 C20 116, 19 124, 20 130 L32 130 C31 122, 31 114, 33 106 Z" fill="#D9672C" />
      </g>

      {/* right arm: waves when you're right */}
      {wave && <g className="sh-wave">
        <path d="M86 100 C96 95, 102 87, 104 78 L116 80 C114 94, 106 106, 95 113 Z" fill="url(#sh-coat)" />
        <path d="M103 81 L116 83" stroke="#B04817" strokeWidth="1.8" strokeLinecap="round" opacity=".7" />
        <ellipse cx="109.5" cy="73.5" rx="6.2" ry="6.6" fill="#2E5E8C" />
        <ellipse cx="103.5" cy="75.5" rx="2.5" ry="3.4" fill="#2E5E8C" transform="rotate(-25 103.5 75.5)" />
      </g>}

      {/* head */}
      <g className="sh-head">
        {/* braided tassels hanging from the ear flaps */}
        <g stroke="#F2C14E" strokeWidth="2.8" strokeLinecap="round">
          <path d="M33 86 L32 100" /><path d="M87 86 L88 100" />
        </g>
        <circle cx="32" cy="101" r="3.3" fill="#F2C14E" /><circle cx="88" cy="101" r="3.3" fill="#F2C14E" />
        <ellipse cx="60" cy="69" rx="27" ry="28" fill="url(#sh-skin)" />
        {/* cheeks, nose, brows */}
        <ellipse cx="43" cy="81" rx="5" ry="3" fill="#E5707A" opacity=".45" />
        <ellipse cx="77" cy="81" rx="5" ry="3" fill="#E5707A" opacity=".45" />
        <path d="M57.5 76 q2.5 4 5 0" stroke="#7A4A2A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M44 66.5 q6 -4 12 -0.5" stroke="#3B2414" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path className="sh-brow" d={mood === 'think' ? 'M64 63 q6 -5 12 -0.5' : 'M64 66 q6 -3.5 12 0.5'} stroke="#3B2414" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* eyes (they blink) */}
        <g className="sh-blink">
          {mood === 'think'
            ? <><ellipse cx="51.4" cy="71.4" rx="3.6" ry="4.4" fill="#2A170B" /><ellipse cx="71.4" cy="71.4" rx="3.6" ry="4.4" fill="#2A170B" /></>
            : <><ellipse cx="50" cy="72.5" rx="3.6" ry="4.4" fill="#2A170B" /><ellipse cx="70" cy="72.5" rx="3.6" ry="4.4" fill="#2A170B" /></>}
          {mood === 'think'
            ? <><circle cx="52.8" cy="69.4" r="1.3" fill="#FFF" /><circle cx="72.8" cy="69.4" r="1.3" fill="#FFF" /><ellipse cx="51" cy="76" rx="4.4" ry="2" fill="#C68A5B" /><ellipse cx="71" cy="76" rx="4.4" ry="2" fill="#C68A5B" /></>
            : <><circle cx="51.3" cy="71" r="1.2" fill="#FFF" /><circle cx="71.3" cy="71" r="1.2" fill="#FFF" /></>}
        </g>
        {/* mouth (it talks) */}
        <g className="sh-talk">
          {mood === 'think'
            ? <path d="M53 86 Q60 91 67 86 Q60 88.5 53 86 Z" fill="#6B2222" stroke="#6B2222" strokeWidth="1.2" strokeLinejoin="round" />
            : <><path d="M49 84 Q60 97 71 84 Z" fill="#6B2222" /><ellipse cx="60" cy="90" rx="5" ry="2.4" fill="#E8848A" /><path d="M50 84.4 L70 84.4" stroke="#FFF" strokeWidth="1.6" /></>}
        </g>
        {/* knitted hat: ear flaps, patterned band, goggles, pom-pom */}
        <path d="M31 58 C29 70, 29 80, 33 87 C37 86, 40 80, 40 70 Z" fill="url(#sh-hat)" />
        <path d="M89 58 C91 70, 91 80, 87 87 C83 86, 80 80, 80 70 Z" fill="url(#sh-hat)" />
        <path d="M31 62 C30 40, 44 28, 60 28 C76 28, 90 40, 89 62 Z" fill="url(#sh-hat)" />
        <path d="M31 55 C44 51, 76 51, 89 55 L89 63 C76 59, 44 59, 31 63 Z" fill="#F2C14E" />
        <path d="M34 59 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4" stroke="#2E5E8C" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
        <g stroke="#B92C35" strokeWidth="1.2" opacity=".6" fill="none"><path d="M44 34 L44 50" /><path d="M52 30 L52 50" /><path d="M60 29 L60 50" /><path d="M68 30 L68 50" /><path d="M76 34 L76 50" /></g>
        <path d="M38 42 L82 42" stroke="#2A2A33" strokeWidth="3" />
        <rect x="39.5" y="35" width="18" height="12.5" rx="5" fill="url(#sh-lens)" stroke="#2A2A33" strokeWidth="2.2" />
        <rect x="62.5" y="35" width="18" height="12.5" rx="5" fill="url(#sh-lens)" stroke="#2A2A33" strokeWidth="2.2" />
        <path d="M44 38.5 l4 0" stroke="#FFF8E0" strokeWidth="1.8" strokeLinecap="round" /><path d="M67 38.5 l4 0" stroke="#FFF8E0" strokeWidth="1.8" strokeLinecap="round" />
        <g className="sh-pom">
          <circle cx="60" cy="25" r="7.5" fill="#F2C14E" />
          <circle cx="57.5" cy="22.5" r="3" fill="#FFE08A" />
        </g>
      </g>
    </svg>
  )
}

// The Sherpa with a speech bubble: the answer panel is what he says.
export function SherpaSays({ ok, mood, className = '', children }) {
  return (
    <div className={`sherpa-says ${ok ? 'ok' : 'no'} ${className}`}>
      <Sherpa mood={mood || (ok ? 'happy' : 'think')} />
      <div className={`feedback bubble ${ok ? 'ok' : 'no'}`}>{children}</div>
    </div>
  )
}
