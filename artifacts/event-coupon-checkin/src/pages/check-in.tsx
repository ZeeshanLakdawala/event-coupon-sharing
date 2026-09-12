import { useState, useRef, useEffect } from 'react';
import { useParams } from 'wouter';
import { useGetEvent, useCheckInAttendee, CheckInResultStatus, getGetEventQueryKey } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckIn() {
  const params = useParams();
  const eventId = params.eventId!;
  const { data: event, isLoading: isEventLoading, isError: isEventError } = useGetEvent(eventId, {
    query: { queryKey: getGetEventQueryKey(eventId), retry: false },
  });
  
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{ status: CheckInResultStatus | 'error', message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const checkInMutation = useCheckInAttendee();

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, [isEventLoading]);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setResult(null);
    checkInMutation.mutate({ eventId, data: { email } }, {
      onSuccess: (data) => {
        setResult({ status: data.status, message: data.message });
      },
      onError: (err: any) => {
        setResult({ status: 'error', message: err?.data?.error || 'Attendee not found or invalid email.' });
      }
    });
  };

  const handleReset = () => {
    setResult(null);
    setEmail('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  if (isEventLoading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (isEventError || !event) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Event Not Found</h1>
        <p className="text-slate-400">The check-in URL is invalid or the event has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-white">
      <div className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
        <ShieldCheck className="w-4 h-4" /> Secure Kiosk Mode
      </div>
      
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-6 px-4 py-1.5 text-sm uppercase tracking-widest">Self Check-In</Badge>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">{event.name}</h1>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Card className="p-8 sm:p-12 shadow-2xl bg-white rounded-[2rem] border-0">
                <form onSubmit={handleCheckIn} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-widest block">Registered Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-300" />
                      </div>
                      <Input 
                        ref={inputRef}
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="pl-14 h-16 text-xl font-medium bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-2xl transition-all"
                        placeholder="hello@example.com"
                        required
                        disabled={checkInMutation.isPending}
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={checkInMutation.isPending || !email} 
                    className="w-full h-16 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.2)] hover:shadow-[0_0_60px_rgba(79,70,229,0.4)] transition-all group disabled:opacity-70 disabled:shadow-none"
                  >
                    {checkInMutation.isPending ? "Verifying Access..." : "Check In"} 
                    {!checkInMutation.isPending && <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3, type: "spring", bounce: 0.5 }} className="w-full">
              {result.status === 'checked_in' && (
                <ResultCard 
                  icon={<CheckCircle2 className="w-24 h-24 text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]" />}
                  title="Access Granted!"
                  message={result.message}
                  color="emerald"
                  onNext={handleReset}
                />
              )}
              {result.status === 'already_checked_in' && (
                <ResultCard 
                  icon={<CheckCircle2 className="w-24 h-24 text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]" />}
                  title="Already Checked In"
                  message={result.message}
                  color="amber"
                  onNext={handleReset}
                />
              )}
              {result.status === 'error' && (
                <ResultCard 
                  icon={<AlertCircle className="w-24 h-24 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]" />}
                  title="Access Denied"
                  message={result.message}
                  color="red"
                  onNext={handleReset}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Badge({ className, variant, ...props }: any) {
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`} {...props} />;
}

function ResultCard({ icon, title, message, color, onNext }: { icon: React.ReactNode, title: string, message: string, color: 'emerald' | 'amber' | 'red', onNext: () => void }) {
  const bgColors = {
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    red: 'bg-red-50 border-red-100'
  };
  const textColors = {
    emerald: 'text-emerald-950',
    amber: 'text-amber-950',
    red: 'text-red-950'
  };
  const btnColors = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
    amber: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
    red: 'bg-red-600 hover:bg-red-700 shadow-red-200'
  };

  return (
    <Card className={`p-10 sm:p-14 shadow-2xl rounded-[2rem] border-2 ${bgColors[color]} flex flex-col items-center text-center`}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring" }} className="mb-8">
        {icon}
      </motion.div>
      <h2 className={`text-4xl font-black mb-4 tracking-tight ${textColors[color]}`}>{title}</h2>
      <p className={`${textColors[color]} opacity-80 text-xl font-medium mb-10`}>{message}</p>
      <Button 
        onClick={onNext} 
        autoFocus
        className={`h-16 px-10 text-xl font-bold text-white rounded-2xl shadow-xl transition-all ${btnColors[color]} w-full sm:w-auto`}
      >
        Next Attendee
      </Button>
    </Card>
  );
}
