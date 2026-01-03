/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   TERMINAL CONTACT FORM - Terminal-style contact UI  ###
   ###   Interactive form with typing animation & validation###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Step {
  field: keyof FormData;
  prompt: string;
  placeholder: string;
  ariaLabel: string;
  validate: (val: string) => string | null;
  multiline?: boolean;
}

interface OutputLine {
  text: string;
  className?: string;
}

/* ###########################################################
   ###   2. Configuration                                   ###
   ########################################################### */

// Sanitize user input to prevent XSS in terminal output
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const steps: Step[] = [
  {
    field: 'name',
    prompt: 'Enter your name:',
    placeholder: 'Your name',
    ariaLabel: 'Your name',
    validate: (val) => (val.length >= 2 ? null : 'Name must be at least 2 characters'),
  },
  {
    field: 'email',
    prompt: 'Enter your email address:',
    placeholder: 'your@email.com',
    ariaLabel: 'Email address',
    validate: (val) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Please enter a valid email address'),
  },
  {
    field: 'subject',
    prompt: 'Enter subject:',
    placeholder: 'What is this about?',
    ariaLabel: 'Message subject',
    validate: (val) => (val.length >= 3 ? null : 'Subject must be at least 3 characters'),
  },
  {
    field: 'message',
    prompt: 'Enter your message (press Enter twice to submit):',
    placeholder: 'Tell me about your project...',
    ariaLabel: 'Your message',
    multiline: true,
    validate: (val) => (val.length >= 10 ? null : 'Message must be at least 10 characters'),
  },
];

/* ###########################################################
   ###   3. Component                                       ###
   ########################################################### */

export default function TerminalContactForm() {
  /* ###########################################################
     ###   State & Refs                                       ###
     ########################################################### */
  const [currentStep, setCurrentStep] = useState(-1);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [honeypot, setHoneypot] = useState(''); // Spam prevention
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const lastEnterRef = useRef(0);

  /* ###########################################################
     ###   Helper Functions                                  ###
     ########################################################### */

  // Add output line to terminal
  const addOutput = useCallback((text: string, className?: string) => {
    setOutput((prev) => [...prev, { text, className }]);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  /* ###########################################################
     ###   Initialization                                    ###
     ########################################################### */

  // Initialize terminal with welcome messages
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      await delay(300);
      if (cancelled) return;
      addOutput('System initialized...', 'text-white/50');
      await delay(400);
      if (cancelled) return;
      addOutput('Loading contact module...', 'text-white/50');
      await delay(300);
      if (cancelled) return;
      addOutput('✓ Contact form ready', 'text-green-400');
      await delay(200);
      if (cancelled) return;
      addOutput('─'.repeat(35), 'text-white/50');
      await delay(300);
      if (cancelled) return;
      addOutput('Welcome! Please fill out the contact form below.', 'text-amber-400');
      addOutput('Type your responses and press Enter to continue.', 'text-white/50');
      addOutput('─'.repeat(35), 'text-white/50');
      await delay(200);
      if (cancelled) return;
      setCurrentStep(0);
    };
    init();

    return () => {
      cancelled = true;
    };
  }, [addOutput]);

  // Prompt current step
  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      addOutput(`[${currentStep + 1}/${steps.length}] ${step.prompt}`, 'text-cyan-400');
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (currentStep >= steps.length && !isSubmitted) {
      showSummary();
    }
  }, [currentStep, addOutput, isSubmitted]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  /* ###########################################################
     ###   Form Submission                                   ###
     ########################################################### */

  // Show summary and send email
  const showSummary = async () => {
    setIsSubmitted(true);
    addOutput('─'.repeat(45), 'text-white/50');
    await delay(300);
    addOutput('Processing submission...', 'text-white/50');

    // Progress animation - first half for validation
    for (let i = 0; i <= 50; i += 10) {
      await delay(80);
      setProgress(i);
    }

    addOutput('✓ Form validated successfully!', 'text-green-400');
    await delay(200);
    addOutput('Sending message...', 'text-white/50');

    // Actually send the email
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: honeypot }),
      });

      // Progress animation - second half for sending
      for (let i = 60; i <= 100; i += 10) {
        await delay(80);
        setProgress(i);
      }

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 429) {
          throw new Error(data.message || 'Too many requests. Please try again later.');
        }
        throw new Error(data.error || 'Failed to send');
      }

      await delay(200);
      addOutput('─'.repeat(35), 'text-white/50');
      addOutput('[ SUBMISSION SUMMARY ]', 'text-amber-400');
      addOutput(`Name: ${escapeHtml(formData.name)}`, 'text-cyan-400');
      addOutput(`Email: ${escapeHtml(formData.email)}`, 'text-cyan-400');
      addOutput(`Subject: ${escapeHtml(formData.subject)}`, 'text-cyan-400');
      addOutput(`Message: ${escapeHtml(formData.message)}`, 'text-cyan-400');
      await delay(400);
      addOutput('─'.repeat(35), 'text-white/50');
      addOutput('✓ Message sent successfully!', 'text-green-400');
      addOutput("Thank you for reaching out. I'll get back to you soon.", 'text-white/50');
    } catch {
      setProgress(100);
      addOutput('─'.repeat(35), 'text-white/50');
      addOutput('✗ Failed to send message.', 'text-red-400');
      addOutput('Please try again or email directly: Antony@aoneill.co.uk', 'text-white/50');
    }

    await delay(500);
    addOutput('', 'text-white/50');
    addOutput('Type "reset" to send another message.', 'text-white/50');
  };

  // Process user input and validate
  const processInput = () => {
    const value = inputValue.trim();
    const step = steps[currentStep];

    addOutput(`→ ${escapeHtml(value)}`, 'text-pink-400');

    const error = step.validate(value);
    if (error) {
      addOutput(`✗ Error: ${error}`, 'text-red-400');
      setInputValue('');
      inputRef.current?.focus();
      return;
    }

    setFormData((prev) => ({ ...prev, [step.field]: value }));
    addOutput(`✓ ${escapeHtml(step.field)} saved`, 'text-green-400');

    setInputValue('');
    setTimeout(() => setCurrentStep((s) => s + 1), 300);
  };

  /* ###########################################################
     ###   Event Handlers                                    ###
     ########################################################### */

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isSubmitted) {
      if (e.key === 'Enter' && inputValue.trim().toLowerCase() === 'reset') {
        setCurrentStep(-1);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setOutput([]);
        setIsSubmitted(false);
        setProgress(0);
        setInputValue('');
        // Re-initialize after reset
        setTimeout(() => {
          setOutput([]);
          const init = async () => {
            await delay(300);
            addOutput('System initialized...', 'text-white/50');
            await delay(400);
            addOutput('Loading contact module...', 'text-white/50');
            await delay(300);
            addOutput('✓ Contact form ready', 'text-green-400');
            await delay(200);
            setCurrentStep(0);
          };
          init();
        }, 100);
      }
      return;
    }

    if (currentStep < 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];

    if (step.multiline) {
      if (e.key === 'Enter') {
        const now = Date.now();
        if (now - lastEnterRef.current < 500) {
          e.preventDefault();
          processInput();
        }
        lastEnterRef.current = now;
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        processInput();
      }
    }
  };

  const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden font-mono text-sm sm:text-base"
      style={{
        background: '#0d0d0d',
        border: '1px solid #333',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 255, 65, 0.1)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3"
        style={{
          background: 'linear-gradient(180deg, #3d3d3d, #2d2d2d)',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#ff5f56' }} />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#ffbd2e' }} />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: '#27ca40' }} />
        <span className="flex-1 text-center text-[11px] sm:text-[13px] text-[#999] mr-[40px] sm:mr-[52px]">
          contact@terminal ~ bash
        </span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="p-3 sm:p-5 min-h-[300px] sm:min-h-[400px] max-h-[400px] sm:max-h-[500px] overflow-y-auto overflow-x-hidden"
        style={{
          background: `
            linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        {/* Honeypot field - hidden from humans, bots will fill it */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            opacity: 0,
            height: 0,
            width: 0,
            pointerEvents: 'none',
          }}
        />

        {/* ASCII Art - hidden on small screens */}
        <div className="hidden sm:block mb-4">
          <pre className="text-[9px] leading-tight text-[#00ff41] opacity-80">
{` █████╗  ██████╗ ███╗   ██╗███████╗██╗██╗     ██╗
██╔══██╗██╔═══██╗████╗  ██║██╔════╝██║██║     ██║
███████║██║   ██║██╔██╗ ██║█████╗  ██║██║     ██║
██╔══██║██║   ██║██║╚██╗██║██╔══╝  ██║██║     ██║
██║  ██║╚██████╔╝██║ ╚████║███████╗██║███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚══════╝╚══════╝`}
          </pre>
          <div className="text-[11px] text-cyan-400 tracking-[0.3em] mt-1 ml-1">CONTACT FORM</div>
        </div>
        {/* Mobile ASCII - simplified */}
        <div className="block sm:hidden mb-3">
          <pre className="text-[7px] leading-tight text-[#00ff41] opacity-80">
{`█████╗  ██████╗ ███╗   ██╗███████╗██╗██╗     ██╗
██╔══██╗██╔═══██╗████╗  ██║██╔════╝██║██║     ██║
███████║██║   ██║██╔██╗ ██║█████╗  ██║██║     ██║
██╔══██║██║   ██║██║╚██╗██║██╔══╝  ██║██║     ██║
██║  ██║╚██████╔╝██║ ╚████║███████╗██║███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚══════╝╚══════╝`}
          </pre>
          <div className="text-[9px] text-cyan-400 tracking-[0.2em] mt-1">CONTACT FORM</div>
        </div>

        {/* Output */}
        {output.map((line, i) => (
          <div
            key={i}
            className={`mb-2 leading-relaxed break-words text-xs sm:text-sm ${line.className || 'text-[#00ff41]'}`}
            style={{ animation: 'fadeInLine 0.3s ease forwards', wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: line.text.replace(/\n/g, '<br>') }}
          />
        ))}

        {/* Progress bar during submission */}
        {isSubmitted && progress < 100 && (
          <div className="w-48 h-1 bg-[#333] rounded-sm overflow-hidden my-2">
            <div
              className="h-full rounded-sm transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00ff41, #27ca40)',
              }}
            />
          </div>
        )}

        {/* Input */}
        {currentStepData && (
          <div className="flex items-start mt-3">
            <span className="text-[#00ff41] mr-2 select-none text-xs sm:text-sm whitespace-nowrap">
              <span className="text-[#ff79c6]">guest</span>
              <span className="text-[#888]">@</span>
              <span className="text-[#8be9fd] hidden sm:inline">contact</span>
              <span className="text-[#888]">:~$</span>
            </span>
            <div className="flex-1">
              {currentStepData.multiline ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentStepData.placeholder}
                  aria-label={currentStepData.ariaLabel}
                  rows={3}
                  className="w-full bg-transparent border-none text-[#f8f8f2] text-sm outline-none resize-none placeholder:text-[#444]"
                  style={{ caretColor: '#00ff41' }}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={currentStepData.field === 'email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentStepData.placeholder}
                  aria-label={currentStepData.ariaLabel}
                  autoComplete={currentStepData.field === 'email' ? 'email' : currentStepData.field === 'name' ? 'name' : 'off'}
                  className="w-full bg-transparent border-none text-[#f8f8f2] text-sm outline-none placeholder:text-[#444]"
                  style={{ caretColor: '#00ff41' }}
                />
              )}
            </div>
          </div>
        )}

        {/* Reset input when submitted */}
        {isSubmitted && (
          <div className="flex items-start mt-3">
            <span className="text-[#00ff41] mr-2 select-none text-xs sm:text-sm whitespace-nowrap">
              <span className="text-[#ff79c6]">guest</span>
              <span className="text-[#888]">@</span>
              <span className="text-[#8be9fd] hidden sm:inline">contact</span>
              <span className="text-[#888]">:~$</span>
            </span>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type reset to start over..."
              aria-label="Type reset to start a new message"
              autoComplete="off"
              className="flex-1 bg-transparent border-none text-[#f8f8f2] text-sm outline-none placeholder:text-[#444]"
              style={{ caretColor: '#00ff41' }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInLine {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
