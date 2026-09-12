export default function CompleteRecord() {
 return <div className="w-screen h-screen overflow-hidden relative bg-[#0C0F1A] text-white font-body">
  <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',backgroundSize:'4vw 4vw'}} />
  <div className="absolute top-[20vh] left-[20vw] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[14vw]" />
  <header className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between z-10"><span className="text-[1.5vw] font-bold">Event Check-in</span><span className="text-[1.5vw] text-white/40">05 / 05</span></header>
  <main className="absolute left-[7vw] right-[7vw] top-[15vh] bottom-[10vh] z-10 flex flex-col items-center text-center">
   <div className="text-primary text-[1.5vw] font-bold tracking-[.12em] uppercase mb-[2vh]">Post-event reporting</div>
   <h2 className="font-display text-[4.7vw] font-extrabold tracking-[-.04em] mb-[5vh]">A complete record after the event</h2>
   <div className="grid grid-cols-5 gap-[1.2vw] w-full mb-[5vh] text-left">
    <div className="bg-[#131726]/90 border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="w-[3vw] h-[.5vh] bg-primary mb-[2.5vh]"/><p className="text-[2vw] leading-[1.3]">Live dashboard: total, checked in, remaining, and emails sent</p></div>
    <div className="bg-[#131726]/90 border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="w-[3vw] h-[.5vh] bg-accent mb-[2.5vh]"/><p className="text-[2vw] leading-[1.3]">Final email: checked-in count and did-not-show count</p></div>
    <div className="bg-[#131726]/90 border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="w-[3vw] h-[.5vh] bg-primary mb-[2.5vh]"/><p className="text-[2vw] leading-[1.3]">Attached CSV: name, email, coupon_code, and status</p></div>
    <div className="bg-[#131726]/90 border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="w-[3vw] h-[.5vh] bg-accent mb-[2.5vh]"/><p className="text-[2vw] leading-[1.3]">Status values: Checked in or Did not show</p></div>
    <div className="bg-[#131726]/90 border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="w-[3vw] h-[.5vh] bg-primary mb-[2.5vh]"/><p className="text-[2vw] leading-[1.3]">End-to-end organizer and attendee preview verified</p></div>
   </div>
   <div className="px-[4vw] py-[2.2vh] bg-white text-[#0C0F1A] rounded-[.8vw] text-[2.2vw] font-extrabold">Ready to publish on always-on compute.</div>
  </main>
 </div>;
}