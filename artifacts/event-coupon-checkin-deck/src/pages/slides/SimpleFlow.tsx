export default function SimpleFlow() {
 return <div className="w-screen h-screen overflow-hidden relative bg-[#0C0F1A] text-white font-body">
  <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',backgroundSize:'4vw 4vw'}} />
  <header className="absolute top-[5vh] left-[5vw] right-[5vw] flex justify-between z-10"><span className="text-[1.5vw] font-bold">Event Check-in</span><span className="text-[1.5vw] text-white/40">03 / 05</span></header>
  <main className="absolute left-[5vw] right-[5vw] top-[15vh] bottom-[10vh] z-10">
   <div className="text-primary text-[1.5vw] font-bold tracking-[.12em] uppercase mb-[2vh]">One connected journey</div>
   <h2 className="font-display text-[4.6vw] font-extrabold tracking-[-.04em] mb-[7vh]">One simple flow for everyone</h2>
   <div className="grid grid-cols-5 gap-[1vw] items-stretch">
    <div className="relative bg-[#131726] border border-primary/30 rounded-[1vw] p-[1.7vw]"><div className="text-[3vw] font-black text-primary mb-[2vh]">1</div><p className="text-[2vw] leading-[1.3]">Organizer creates the event and uploads name, email, and coupon_code</p><div className="absolute top-1/2 right-[-1.3vw] text-primary text-[2.5vw]">→</div></div>
    <div className="relative bg-[#131726] border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="text-[3vw] font-black text-accent mb-[2vh]">2</div><p className="text-[2vw] leading-[1.3]">Organizer shares one event-specific link or QR code</p><div className="absolute top-1/2 right-[-1.3vw] text-primary text-[2.5vw]">→</div></div>
    <div className="relative bg-[#131726] border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="text-[3vw] font-black text-primary mb-[2vh]">3</div><p className="text-[2vw] leading-[1.3]">Attendee enters the email used during registration</p><div className="absolute top-1/2 right-[-1.3vw] text-primary text-[2.5vw]">→</div></div>
    <div className="relative bg-[#131726] border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="text-[3vw] font-black text-accent mb-[2vh]">4</div><p className="text-[2vw] leading-[1.3]">A valid match is checked in and receives the coupon by email</p><div className="absolute top-1/2 right-[-1.3vw] text-primary text-[2.5vw]">→</div></div>
    <div className="bg-[#131726] border border-white/10 rounded-[1vw] p-[1.7vw]"><div className="text-[3vw] font-black text-primary mb-[2vh]">5</div><p className="text-[2vw] leading-[1.3]">Invalid emails receive a private error with no data exposure</p></div>
   </div>
  </main>
 </div>;
}