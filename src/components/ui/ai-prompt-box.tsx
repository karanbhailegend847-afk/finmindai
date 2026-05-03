import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, Globe, BrainCog, FolderCode, Sparkles, BarChart3, Zap, ShieldCheck, TrendingUp, LineChart, Cpu, Search, Activity, Plus, Image, Lightbulb, Telescope, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as PopoverPrimitive from "@radix-ui/react-popover";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// Embedded CSS for minimal custom styles
const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #4c3a69;
    border-radius: 3px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: #7c5dfa;
  }
`;

// Inject styles into document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none scrollbar-thin scrollbar-thumb-[#4c3a69] scrollbar-track-transparent hover:scrollbar-thumb-[#7c5dfa]",
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-[#4c3a69] bg-[#1a1625] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Dialog Components
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#4c3a69] bg-[#1a1625] p-0 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[#2E3033]/80 p-2 hover:bg-[#2E3033] transition-all">
        <X className="h-5 w-5 text-gray-200 hover:text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;


// Popover Components
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-2xl border border-[#2A2339] bg-[#1a1625]/95 backdrop-blur-xl p-1 text-gray-100 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;


// Intelligence Modules Data
const INTELLIGENCE_MODULES = [
  {
    id: "market-simulator",
    title: "Market Simulator",
    description: "Predict growth based on news data.",
    icon: <BarChart3 className="w-4 h-4 text-[#9CA3AF]" />,
    prompt: "Perform a high-fidelity [MARKET_SIMULATION] for [STOCK_TICKER]. Analyze current macroeconomic tailwinds and recent news data to project Bull, Bear, and Base case temporal scenarios over a 12-month horizon. Break down the specific key drivers and give a definitive institutional verdict.",
    color: "blue",
    minPlan: "starter"
  },
  {
    id: "alpha-signals",
    title: "Trade Signals",
    description: "Predictive alpha and trading signals.",
    icon: <Zap className="w-4 h-4 text-[#9CA3AF]" />,
    prompt: "Generate a Tier-1 [TRADE_SIGNAL] for [STOCK_TICKER]. Synthesize price action, RSI/MACD divergence, and institutional order flow. Provide clear Entry, Target (T1, T2), and Stop-Loss levels with a calculated Risk/Reward ratio.",
    color: "yellow",
    minPlan: "starter"
  },
  {
    id: "sentiment-audit",
    title: "Market Mood",
    description: "Global news and social sentiment.",
    icon: <Globe className="w-4 h-4 text-[#9CA3AF]" />,
    prompt: "Execute a deep [MARKET_MOOD] audit for [STOCK_TICKER]. Aggregate sentiment from recent news, earnings sentiment analysis, and social velocity. Identify if the current mood is driven by FOMO, panic, or rational accumulation.",
    color: "purple",
    minPlan: "advance"
  },
  {
    id: "risk-optimizer",
    title: "Portfolio Strategy",
    description: "Sharpe ratio and risk optimization.",
    icon: <ShieldCheck className="w-4 h-4 text-[#9CA3AF]" />,
    prompt: "Draft a [PORTFOLIO_STRATEGY] based on my current risk profile. Use Hierarchical Risk Parity to suggest optimal asset weights. Run a stress test against a 20% market correction scenario and provide a Diversification Score.",
    color: "green",
    minPlan: "advance"
  },
  {
    id: "fraud-scan",
    title: "Fraud Detector",
    description: "Anomaly and irregularity detection.",
    icon: <Activity className="w-4 h-4 text-[#9CA3AF]" />,
    prompt: "Initiate a [FRAUD_DETECTION] scan for [STOCK_TICKER/PROJECT]. Cross-reference regulatory filings, look for 'pump and dump' volume patterns, and verify board member history against known red flags. Provide a calculated Risk Score.",
    color: "red",
    minPlan: "advance"
  }
];

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-primary hover:bg-primary/80 text-white",
      outline: "border border-[#4c3a69] bg-transparent hover:bg-[#2a2339]",
      ghost: "bg-transparent hover:bg-[#2a2339]",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "h-8 w-8 rounded-full aspect-[1/1]",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ImageViewDialog Component
interface ImageViewDialogProps {
  imageUrl: string | null;
  onClose: () => void;
}
const ImageViewDialog: React.FC<ImageViewDialogProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[90vw] md:max-w-[800px]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-[#1a1625] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={imageUrl}
            alt="Full preview"
            className="w-full max-h-[80vh] object-contain rounded-2xl"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// PromptInput Context and Components
interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});
function usePromptInput() {
  const context = React.useContext(PromptInputContext);
  if (!context) throw new Error("usePromptInput must be used within a PromptInput");
  return context;
}

interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}
const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 240,
      value,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
      onDragOver,
      onDragLeave,
      onDrop,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };
    return (
      <TooltipProvider>
        <PromptInputContext.Provider
          value={{
            isLoading,
            value: value ?? internalValue,
            setValue: onValueChange ?? handleChange,
            maxHeight,
            onSubmit,
            disabled,
          }}
        >
          <div
            ref={ref}
            className={cn(
              "rounded-3xl border border-[#4c3a69] bg-[#1a1625] p-1.5 sm:p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300 max-w-full overflow-hidden",
              isLoading && "border-primary/70",
              className
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    );
  }
);
PromptInput.displayName = "PromptInput";

interface PromptInputTextareaProps {
  disableAutosize?: boolean;
  placeholder?: string;
}
const PromptInputTextarea: React.FC<PromptInputTextareaProps & React.ComponentProps<typeof Textarea>> = ({
  className,
  onKeyDown,
  disableAutosize = false,
  placeholder,
  ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-base", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}
const PromptInputActions: React.FC<PromptInputActionsProps> = ({ children, className, ...props }) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}
const PromptInputAction: React.FC<PromptInputActionProps> = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) => {
  const { disabled } = usePromptInput();
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

// Custom Divider Component
const CustomDivider: React.FC = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div
      className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/70 to-transparent rounded-full"
      style={{
        clipPath: "polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)",
      }}
    />
  </div>
);

// Main PromptInputBox Component
interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  plan?: 'free' | 'starter' | 'advance';
}
export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
  const { onSend = () => {}, isLoading = false, placeholder = "Type your message here...", className, plan = 'free' } = props;
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [filePreviews, setFilePreviews] = React.useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isModulesOpen, setIsModulesOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showThink, setShowThink] = React.useState(false);
  const [showCanvas, setShowCanvas] = React.useState(false);
  const [activeModule, setActiveModule] = React.useState<typeof INTELLIGENCE_MODULES[0] | null>(null);
  const [showUpgradeLock, setShowUpgradeLock] = React.useState<{ title: string, plan: string } | null>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const promptBoxRef = React.useRef<HTMLDivElement>(null);



  const isImageFile = (file: File) => file.type.startsWith("image/");

  const processFile = (file: File) => {
    if (!isImageFile(file)) {
      console.log("Only image files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      console.log("File too large (max 10MB)");
      return;
    }
    setFiles([file]);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => isImageFile(file));
    if (imageFiles.length > 0) processFile(imageFiles[0]);
  }, []);

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove && filePreviews[fileToRemove.name]) setFilePreviews({});
    setFiles([]);
  };

  const openImageModal = (imageUrl: string) => setSelectedImage(imageUrl);

  const handlePaste = React.useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          processFile(file);
          break;
        }
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      let messagePrefix = "";
      // Add active module context
      let finalInput = input;
      if (activeModule) {
        // Replace placeholders in the module prompt with the user's input
        const modulePrompt = activeModule.prompt
          .replace(/\[STOCK_TICKER\]/g, input)
          .replace(/\[STOCK_TICKER\/PROJECT\]/g, input);
        
        // If the user didn't provide input, just use the module prompt directly
        finalInput = input.trim() ? `${modulePrompt}\n\nUser Query: ${input}` : modulePrompt;
      }

      const formattedInput = messagePrefix ? `${messagePrefix}${finalInput}` : finalInput;
      onSend(formattedInput, files);
      setInput("");
      setFiles([]);
      setFilePreviews({});
      setActiveModule(null);
    }
  };

  const getModuleLockStatus = (module: typeof INTELLIGENCE_MODULES[0]) => {
    const userPlan = plan.toLowerCase();
    if (userPlan === 'advance') return null;
    if (userPlan === 'starter') {
      return module.minPlan === 'advance' ? 'Advance Intelligence' : null;
    }
    return module.minPlan === 'starter' ? 'Starter Pack' : 'Advance Intelligence';
  };




  const hasContent = input.trim() !== "" || files.length > 0;

  return (
    <>
      <PromptInput
        value={input}
        onValueChange={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className={cn(
          "w-full bg-[#1a1625] border-[#4c3a69] shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300 ease-in-out",
          className
        )}
        disabled={isLoading}
        ref={ref || promptBoxRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {activeModule && (
          <div className="mx-4 mt-2 flex items-center justify-between p-2 rounded-xl bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                {activeModule.icon}
              </div>
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block leading-none">Active Intelligence</span>
                <span className="text-xs font-bold text-white leading-none">{activeModule.title}</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveModule(null)}
              className="p-1 rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 p-0 pb-1 transition-all duration-300">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") && filePreviews[file.name] && (
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                    onClick={() => openImageModal(filePreviews[file.name])}
                  >
                    <img
                      src={filePreviews[file.name]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeModule && (
          <div className="flex items-center gap-2 pb-2 transition-all animate-in fade-in slide-in-from-left-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <span className="scale-90">{activeModule.icon}</span>
              <span className="text-xs font-medium">{activeModule.title} Mode</span>
              <button 
                onClick={() => setActiveModule(null)}
                className="hover:text-white transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="opacity-100">
          <PromptInputTextarea
            placeholder={placeholder}
            className="text-base"
          />
        </div>

        <PromptInputActions className="flex items-center justify-between gap-2 p-0 pt-2">
          <div className="flex items-center gap-1 opacity-100 visible">
            <PromptInputAction tooltip="Intelligence Modules">
              <button
                type="button"
                onClick={() => setIsModulesOpen(true)}
                className="flex h-8 w-8 text-primary cursor-pointer items-center justify-center rounded-full transition-all hover:bg-primary/20 hover:scale-110"
              >
                <Sparkles className="h-5 w-5 fill-primary/20" />
              </button>
            </PromptInputAction>

            <Popover open={isModulesOpen} onOpenChange={setIsModulesOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 border border-[#2A2339]",
                    isModulesOpen ? "bg-primary text-white scale-110" : "bg-transparent text-[#9CA3AF] hover:bg-[#2A2339] hover:text-white"
                  )}
                >
                  <Plus className={cn("h-5 w-5 transition-transform duration-200", isModulesOpen && "rotate-45")} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-1.5" side="top" align="start">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => {
                      uploadInputRef.current?.click();
                      setIsModulesOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="flex items-center justify-center w-5 h-5 text-[#9CA3AF] group-hover:text-white">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-[#D1D5DB] group-hover:text-white">Upload photos & files</span>
                  </button>

                  <div className="h-[1px] bg-[#2A2339] my-1 mx-2" />

                  {INTELLIGENCE_MODULES.map((module) => {
                    const locked = !!getModuleLockStatus(module);
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => {
                          const requiredPlan = getModuleLockStatus(module);
                          if (requiredPlan) {
                            setShowUpgradeLock({ 
                              title: module.title, 
                              plan: requiredPlan
                            });
                            return;
                          }
                          setActiveModule(module);
                          setIsModulesOpen(false);
                          setTimeout(() => {
                            const textarea = document.querySelector('textarea');
                            if (textarea) textarea.focus();
                          }, 100);
                        }}
                        className={cn(
                          "flex items-center justify-between w-full p-2.5 rounded-lg transition-colors text-left group",
                          locked ? "opacity-60 cursor-not-allowed" : "hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex items-center justify-center w-5 h-5 transition-transform",
                            !locked && "group-hover:scale-110"
                          )}>
                            {module.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#D1D5DB] group-hover:text-white">{module.title}</span>
                          </div>
                        </div>
                        {locked && (
                          <ShieldCheck className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary transition-colors" />
                        )}
                      </button>
                    );
                  })}


                </div>
              </PopoverContent>
            </Popover>


          </div>

          <PromptInputAction
            tooltip={
              isLoading
                ? "Stop generation"
                : hasContent
                ? "Send message"
                : "Type to message"
            }
          >
            <Button
              variant="default"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-200",
                hasContent
                  ? "bg-primary hover:bg-primary/80 text-white"
                  : "bg-transparent hover:bg-primary/10 text-[#9CA3AF] hover:text-primary"
              )}
              onClick={() => {
                if (hasContent) handleSubmit();
              }}
              disabled={isLoading || !hasContent}
            >
              {isLoading ? (
                <Square className="h-4 w-4 fill-white animate-pulse" />
              ) : (
                <ArrowUp className="h-4 w-4 text-white" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>

        {/* Upgrade Lock Modal */}
        <Dialog open={!!showUpgradeLock} onOpenChange={(open) => !open && setShowUpgradeLock(null)}>
          <DialogContent className="p-8 border-primary/20 bg-[#0D0D12] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="flex flex-col items-center text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(123,92,240,0.15)]">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Unlock {showUpgradeLock?.title}</h2>
                <p className="text-slate-400 text-sm max-w-[300px] leading-relaxed">
                  Advanced intelligence modules require <span className="text-white font-semibold">{showUpgradeLock?.plan}</span> or higher to process complex financial data.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                  Upgrade My Plan
                </button>
                <button 
                  onClick={() => setShowUpgradeLock(null)}
                  className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold text-sm transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
          </DialogContent>
        </Dialog>
      </PromptInput>

      <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
});
PromptInputBox.displayName = "PromptInputBox";
