$file = 'c:\react_3d\src\pages\RingConfigure.tsx'
$allLines = [System.IO.File]::ReadAllLines($file)

# Find the index of "export default function RingConfigure"
$exportIdx = -1
for ($i = 0; $i -lt $allLines.Length; $i++) {
    if ($allLines[$i] -match 'export default function RingConfigure') {
        $exportIdx = $i
        break
    }
}
Write-Host "export default found at line: $($exportIdx + 1)"

# Take everything from that line onward as the "rest of file"
$rest = $allLines[$exportIdx..($allLines.Length - 1)]

# Build the clean top section (lines 0-54 are already good: imports + STEPS + materialsData)
# Lines 0-54 (indices 0-53) are clean - just need lines 1-54
$top = $allLines[0..53]

# The clean StepContent block
$stepContent = @(
'',
'// --- StepContent ---',
'// MUST live at module scope - React creates a new component type on every render',
'// if defined inside RingConfigure, unmounting StepContent and resetting its state.',
'function StepContent({',
'    step: s,',
'    activeOption,',
'    onSelect,',
'    onOpenDrawer,',
'}: {',
'    step: typeof STEPS[number];',
'    activeOption: string;',
'    onSelect: (option: string) => void;',
'    onOpenDrawer: () => void;',
'}) {',
'    // -- Title fade --',
'    const [titleVisible, setTitleVisible] = useState(false);',
'',
'    // -- Options width animation --',
'    // innerRef measures the natural scrollWidth of the options row.',
'    // measuredWidth starts at 0 then transitions to scrollWidth px,',
'    // so the outer wrapper smoothly expands to fit exactly the text width.',
'    const innerRef = useRef<HTMLDivElement>(null);',
'    const [measuredWidth, setMeasuredWidth] = useState(0);',
'    const [optionsVisible, setOptionsVisible] = useState(false);',
'',
'    useLayoutEffect(() => {',
'        if (!innerRef.current) return;',
'        const w = innerRef.current.scrollWidth;',
'        // Double rAF: same pattern as pagination dots.',
'        // First frame paints collapsed state, second triggers the CSS transition.',
'        let id1: number, id2: number;',
'        id1 = requestAnimationFrame(() => {',
'            id2 = requestAnimationFrame(() => {',
'                setMeasuredWidth(w);',
'                setOptionsVisible(true);',
'                setTitleVisible(true);',
'            });',
'        });',
'        return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2); };',
'    }, []); // empty - key={currentStep} causes a full remount per step',
'',
'    return (',
'        <div>',
'            {/* Title - fade in from slightly above */}',
'            <div',
'                style={{',
'                    opacity: titleVisible ? 1 : 0,',
'                    transform: titleVisible ? "translateY(0)" : "translateY(-4px)",',
'                    transition: "opacity 400ms ease-out, transform 400ms ease-out",',
'                }}',
'                className="flex items-center justify-start gap-2"',
'            >',
'                <h2 className="text-[16px] font-semibold font-outfit uppercase">{s.title}</h2>',
'                {s.hasInfo && (',
'                    <button onClick={onOpenDrawer} className="cursor-pointer group rounded-full border border-transparent hover:border-[#141414] transition-colors duration-300">',
'                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">',
'                            <path className="stroke-[#141414] group-hover:stroke-white transition-colors duration-300" d="M10 5.75C12.3472 5.75 14.25 7.65279 14.25 10C14.25 12.3472 12.3472 14.25 10 14.25C7.65279 14.25 5.75 12.3472 5.75 10C5.75 7.65279 7.65279 5.75 10 5.75Z" strokeWidth="9.5" strokeMiterlimit="10" />',
'                            <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M9.99987 13.9749V8.4082H8.4082" strokeWidth="1.5" strokeMiterlimit="10" />',
'                            <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M8.4082 13.9751H11.5915" strokeWidth="2" strokeMiterlimit="10" />',
'                            <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M9.2085 5.52002H10.7918" strokeWidth="2" strokeMiterlimit="10" />',
'                        </svg>',
'                    </button>',
'                )}',
'            </div>',
'',
'            {/* Options - outer wrapper transitions width 0 to measuredWidth px.',
'                Inner div uses w-max so it always holds its full natural width',
'                and acts as the measurement target via scrollWidth. */}',
'            <div',
'                style={{',
'                    width: measuredWidth,',
'                    overflow: "hidden",',
'                    transition: "width 500ms ease-out",',
'                }}',
'                className="mt-4"',
'            >',
'                <div',
'                    ref={innerRef}',
'                    style={{',
'                        opacity: optionsVisible ? 1 : 0,',
'                        transition: "opacity 350ms ease-out",',
'                    }}',
'                    className="flex gap-4 w-max"',
'                >',
'                    {s.options.map((option) => (',
'                        <AnimatedLink',
'                            key={option}',
'                            className={`font-outfit text-[16px] transition-colors duration-300 ${',
'                                activeOption === option',
'                                    ? "text-[#141414] underline underline-offset-4"',
'                                    : "text-[#737373] hover:text-[#141414]"',
'                            }`}',
'                            as="button"',
'                            onClick={() => onSelect(option)}',
'                        >',
'                            {option.startsWith("18KT ") ? (',
'                                <>',
'                                    <span className="md:hidden">{option.slice(5)}</span>',
'                                    <span className="hidden md:inline">{option}</span>',
'                                </>',
'                            ) : (',
'                                option',
'                            )}',
'                        </AnimatedLink>',
'                    ))}',
'                </div>',
'            </div>',
'        </div>',
'    );',
'}',
''
)

# Combine: clean top (0-53) + StepContent + rest from export onward
$final = New-Object System.Collections.Generic.List[string]
foreach ($l in $top) { $final.Add($l) }
foreach ($l in $stepContent) { $final.Add($l) }
foreach ($l in $rest) { $final.Add($l) }

$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($file, $final, $enc)
Write-Host "Written. Total lines: $($final.Count)"
