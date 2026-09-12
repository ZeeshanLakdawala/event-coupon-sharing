export default function PrivacyWorkflow() {
 return <div className="w-screen h-screen overflow-hidden relative bg-[#0C0F1A] text-white font-body">
  <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',backgroundSize:'4vw 4vw'}} />
  <div className="absolute bottom-[-25vh] left-[-10vw] w-[55vw] h-[55vw] rounded-full bg-accent/10 blur-[10vw]" />
  <header className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between z-10"><span className="text-[1.5vw] font-bold">Event Check-in</span><span className="text-[1.5vw] text-white/40">04 / 05</span></header>
  <main className="absolute left-[5vw] right-[5vw] top-[16vh] bottom-[10vh] z-10 grid grid-cols-[.9fr_1.1fr] gap-[7vw] items-center">
   <div><div className="w-[8vw] h-[8vw] rounded-[2vw] bg-primary flex items-center justify-center mb-[4vh]"><svg viewBox="0 0 24 24" className="w-[4vw] h-[4vw]" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/></svg></div><h2 className="font-display text-[4.6vw] font-extrabold leading-[1.05] tracking-[-.04em]">Privacy built into the workflow</h2></div>
   <div className="space-y-[2.2vh]">
    <div className="flex gap-[1.5vw] items-start"><span className="text-primary text-[2.2vw] font-bold">01</span><p className="text-[2vw] leading-[1.35]">Coupon codes never appear in organizer-facing API responses</p></div>
    <div className="flex gap-[1.5vw] items-start"><span className="text-accent text-[2.2vw] font-bold">02</span><p className="text-[2vw] leading-[1.35]">The QR code identifies the event—not the attendee or coupon</p></div>
    <div className="flex gap-[1.5vw] items-start"><span className="text-primary text-[2.2vw] font-bold">03</span><p className="text-[2vw] leading-[1.35]">Check-in is recorded only after the email service accepts delivery</p></div>
    <div className="flex gap-[1.5vw] items-start"><span className="text-accent text-[2.2vw] font-bold">04</span><p className="text-[2vw] leading-[1.35]">Data deletion defaults to one day after the event</p></div>
    <div className="flex gap-[1.5vw] items-start"><span className="text-primary text-[2.2vw] font-bold">05</span><p className="text-[2vw] leading-[1.35]">Final CSV reports are emailed only to the stored organizer address</p></div>
   </div>
  </main>
 </div>;
}