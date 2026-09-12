export default function EventDayProblem() {
 return <div className="w-screen h-screen overflow-hidden relative bg-[#0C0F1A] text-white font-body">
  <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',backgroundSize:'4vw 4vw'}} />
  <div className="absolute -top-[20vh] right-[-10vw] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[8vw]" />
  <header className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between z-10"><span className="text-[1.5vw] font-bold">Event Check-in</span><span className="text-[1.5vw] text-white/40">02 / 05</span></header>
  <main className="absolute left-[5vw] right-[5vw] top-[17vh] bottom-[12vh] z-10 grid grid-cols-[.85fr_1.15fr] gap-[7vw] items-center">
   <div><div className="text-primary text-[1.5vw] font-bold tracking-[.12em] uppercase mb-[3vh]">The event-day problem</div><h2 className="font-display text-[5vw] font-extrabold leading-[1.05] tracking-[-.04em]">The event-day problem</h2></div>
   <div className="grid grid-cols-2 gap-[1.5vw]">
    <div className="bg-[#131726] border border-white/10 rounded-[1vw] p-[2vw] min-h-[22vh]"><div className="text-[4vw] font-black text-primary mb-[2vh]">01</div><p className="text-[2vw] leading-[1.35]">Manual check-in creates queues and transcription errors</p></div>
    <div className="bg-[#131726] border border-white/10 rounded-[1vw] p-[2vw] min-h-[22vh]"><div className="text-[4vw] font-black text-accent mb-[2vh]">02</div><p className="text-[2vw] leading-[1.35]">Public coupon lists expose attendee information</p></div>
    <div className="bg-[#131726] border border-white/10 rounded-[1vw] p-[2vw] min-h-[22vh]"><div className="text-[4vw] font-black text-primary mb-[2vh]">03</div><p className="text-[2vw] leading-[1.35]">Organizers need a reliable record of attendance</p></div>
    <div className="bg-[#131726] border border-white/10 rounded-[1vw] p-[2vw] min-h-[22vh]"><div className="text-[4vw] font-black text-accent mb-[2vh]">04</div><p className="text-[2vw] leading-[1.35]">Attendees should receive only their own coupon code</p></div>
   </div>
  </main>
 </div>;
}