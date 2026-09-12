import { useState, useEffect, useRef } from 'react';
import { 
  useCreateEvent, useGetEvent, useImportAttendees, useSendFinalReport,
  useGetEventSummary, useListAttendees, 
  getGetEventQueryKey, getGetEventSummaryQueryKey, getListAttendeesQueryKey 
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { extractAttendeesFromCsv } from '@/lib/csv-parser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { UploadCloud, Copy, Users, CheckCircle, Mail, Clock, CalendarPlus, ExternalLink, Printer, FileDown } from 'lucide-react';

export default function Dashboard() {
  const [eventId, setEventId] = useState<string | null>(localStorage.getItem('eventId'));

  const handleSetEventId = (id: string | null) => {
    if (id) localStorage.setItem('eventId', id);
    else localStorage.removeItem('eventId');
    setEventId(id);
  };

  if (!eventId) {
    return <CreateEvent onCreated={handleSetEventId} />;
  }

  return <EventDashboard eventId={eventId} onClear={() => handleSetEventId(null)} />;
}

function CreateEvent({ onCreated }: { onCreated: (id: string) => void }) {
  const [name, setName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  
  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  
  const [eventDate, setEventDate] = useState(today.toISOString().slice(0, 10));
  const [dataDeleteDate, setDataDeleteDate] = useState(nextDay.toISOString().slice(0, 10));
  
  const createMutation = useCreateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { 
        data: { 
          name, 
          organizerEmail,
          eventDate,
          dataDeleteDate,
        } 
      },
      {
        onSuccess: (data) => {
          toast({ title: 'Event Created', description: `Successfully created ${data.name}` });
          onCreated(data.id);
        },
        onError: () => {
          toast({ title: 'Creation Failed', description: 'Please check your inputs', variant: 'destructive' });
        }
      }
    );
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center space-y-3">
        <div className="inline-block p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
           <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Access Control</h1>
        <p className="text-slate-500 font-medium">Fast, secure event check-in utility.</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-8 pt-10 px-10 bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <CalendarPlus className="w-6 h-6 text-indigo-500" />
            New Event
          </CardTitle>
          <CardDescription className="text-base mt-2 text-slate-500">
            Set up your event to start importing and checking in attendees.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizerEmail" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Organizer Email</Label>
              <Input
                id="organizerEmail"
                type="email"
                value={organizerEmail}
                onChange={e => setOrganizerEmail(e.target.value)}
                required
                placeholder="organizer@example.com"
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 text-lg px-4"
              />
              <p className="text-xs text-slate-500 mt-1 font-medium">The final attendance CSV will be sent here after the event.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Event Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. VIP Afterparty" 
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 text-lg px-4" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Event Date</Label>
              <Input 
                id="eventDate" 
                type="date" 
                value={eventDate} 
                onChange={e => {
                  const nextEventDate = e.target.value;
                  setEventDate(nextEventDate);
                  const deletionDate = new Date(`${nextEventDate}T00:00:00`);
                  deletionDate.setDate(deletionDate.getDate() + 1);
                  setDataDeleteDate(deletionDate.toISOString().slice(0, 10));
                }}
                required 
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 px-4" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleteDate" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Data Deletion Date</Label>
              <Input 
                id="deleteDate" 
                type="date" 
                value={dataDeleteDate} 
                onChange={e => setDataDeleteDate(e.target.value)} 
                required 
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 px-4" 
              />
              <p className="text-xs text-slate-500 mt-1 font-medium">Attendee data will be automatically purged after this date for privacy compliance.</p>
            </div>
            <Button 
              type="submit" 
              disabled={createMutation.isPending} 
              className="w-full h-14 text-lg font-bold mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all"
            >
              {createMutation.isPending ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


function EventDashboard({ eventId, onClear }: { eventId: string, onClear: () => void }) {
  const { data: event, isLoading: isEventLoading, isError: isEventError } = useGetEvent(eventId, {
    query: { queryKey: getGetEventQueryKey(eventId), retry: false },
  });
  const { data: summary } = useGetEventSummary(eventId, {
    query: {
      queryKey: getGetEventSummaryQueryKey(eventId),
      enabled: !!event,
      refetchInterval: 10000,
    },
  });
  const { data: attendees } = useListAttendees(eventId, {
    query: {
      queryKey: getListAttendeesQueryKey(eventId),
      enabled: !!event,
      refetchInterval: 10000,
    },
  });
  
  const importMutation = useImportAttendees();
  const reportMutation = useSendFinalReport();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEventError) {
      toast({ title: 'Event not found', description: 'Returning to create event', variant: 'destructive' });
      onClear();
    }
  }, [isEventError, onClear]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = extractAttendeesFromCsv(text);
      if (parsed.length === 0) throw new Error("No valid attendees found");

      toast({ title: 'Uploading...', description: `Importing ${parsed.length} attendees. This may take a moment.` });
      
      importMutation.mutate(
        { eventId, data: { attendees: parsed } },
        {
          onSuccess: (res) => {
            toast({ 
              title: 'Import complete', 
              description: `Successfully imported ${res.imported} attendees. ${res.rejected > 0 ? `${res.rejected} rejected.` : ''}` 
            });
            queryClient.invalidateQueries({ queryKey: getGetEventSummaryQueryKey(eventId) });
            queryClient.invalidateQueries({ queryKey: getListAttendeesQueryKey(eventId) });
            queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) });
          },
          onError: (err: any) => {
            toast({ title: 'Import failed', description: err?.data?.error || 'Unknown error occurred.', variant: 'destructive' });
          }
        }
      );
    } catch (err: any) {
      toast({ title: 'Error parsing CSV', description: err.message, variant: 'destructive' });
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyUrl = () => {
    // Rely on standard route for robust copying, fallback to API url if needed
    const url = `${window.location.origin}/check-in/${eventId}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'Link Copied', description: 'Check-in URL copied to clipboard.' });
  };

  const checkInUrl = `${window.location.origin}/check-in/${eventId}`;

  const emailFinalReport = () => {
    reportMutation.mutate(
      { eventId },
      {
        onSuccess: (result) => {
          toast({
            title: result.sent ? 'Final report emailed' : 'Report already sent',
            description: `${result.checkedIn} checked in, ${result.didNotShow} did not show.`,
          });
        },
        onError: (err: any) => {
          toast({ title: 'Report failed', description: err?.data?.error || 'Could not email the report.', variant: 'destructive' });
        },
      },
    );
  };

  if (isEventLoading || !event) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
           <p className="text-slate-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 font-sans p-6 md:p-10 lg:p-14">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <Badge variant="outline" className="mb-3 text-indigo-600 border-indigo-200 bg-indigo-50 font-bold px-3 py-1">Active Event</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">{event.name}</h1>
            <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
              <CalendarPlus className="w-5 h-5" />
              {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-12 px-6 gap-2 bg-white rounded-xl border-slate-200 shadow-sm hover:bg-slate-50 font-semibold" asChild>
              <a href={`/check-in/${eventId}`} target="_blank" rel="noreferrer">
                <ExternalLink className="w-5 h-5 text-indigo-500" /> Open Kiosk
              </a>
            </Button>
            <Button variant="outline" className="h-12 px-6 gap-2 bg-white rounded-xl border-slate-200 shadow-sm hover:bg-slate-50 font-semibold" onClick={copyUrl}>
              <Copy className="w-5 h-5 text-slate-500" /> Copy Link
            </Button>
            <Button variant="outline" disabled={reportMutation.isPending || !attendees?.length} className="h-12 px-6 gap-2 bg-white rounded-xl border-slate-200 shadow-sm hover:bg-slate-50 font-semibold" onClick={emailFinalReport}>
              <FileDown className="w-5 h-5 text-emerald-600" /> {reportMutation.isPending ? 'Sending…' : 'Email Final CSV'}
            </Button>
            <Button variant="ghost" className="h-12 px-6 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold rounded-xl" onClick={onClear}>
              Close Event
            </Button>
          </div>
        </header>

        <section className="print-qr-panel bg-slate-950 text-white rounded-3xl p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-7 shadow-xl shadow-slate-200">
          <div className="max-w-2xl">
            <Badge className="mb-3 bg-indigo-500 text-white border-0">Attendee check-in</Badge>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Share one QR code at the entrance</h2>
            <p className="text-slate-300 font-medium">Attendees scan it, enter the email they registered with, and receive their coupon privately by email.</p>
            <Button onClick={() => window.print()} className="mt-5 h-11 px-5 gap-2 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl">
              <Printer className="w-4 h-4" /> Print QR Code
            </Button>
          </div>
          <div className="bg-white rounded-2xl p-4 shrink-0">
            <QRCodeSVG value={checkInUrl} size={150} level="M" aria-label={`Check-in QR code for ${event.name}`} />
          </div>
        </section>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <SummaryCard title="Total Attendees" value={summary?.total || 0} icon={<Users className="w-7 h-7 text-indigo-500" />} />
           <SummaryCard title="Checked In" value={summary?.checkedIn || 0} icon={<CheckCircle className="w-7 h-7 text-emerald-500"/>} />
           <SummaryCard title="Remaining" value={summary?.remaining || 0} icon={<Clock className="w-7 h-7 text-orange-500"/>} />
           <SummaryCard title="Emails Sent" value={summary?.emailSent || 0} icon={<Mail className="w-7 h-7 text-sky-500"/>} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upload Section */}
          <Card className="xl:col-span-1 border-dashed border-2 border-indigo-200 bg-indigo-50/30 shadow-none rounded-3xl">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center h-full min-h-[350px]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md shadow-indigo-100">
                <UploadCloud className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-indigo-950">Import Roster</h3>
              <p className="text-base text-slate-600 mb-8 font-medium leading-relaxed">
                Upload a CSV with <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-indigo-600">email</code> and <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-indigo-600">coupon_code</code> columns.
              </p>
              <Button onClick={() => fileInputRef.current?.click()} disabled={importMutation.isPending} className="w-full h-14 text-lg font-bold rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all">
                {importMutation.isPending ? "Importing Data..." : "Select CSV File"}
              </Button>
              <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </CardContent>
          </Card>

          {/* Attendees Table */}
          <Card className="xl:col-span-2 shadow-sm border border-slate-100 rounded-3xl overflow-hidden flex flex-col">
            <CardHeader className="bg-white border-b border-slate-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Attendee Roster</CardTitle>
                  <CardDescription className="text-sm mt-1">Live view. Coupon codes are hidden for security.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-slate-50 text-slate-600 px-3 py-1">
                  Auto-updating
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden bg-white">
              <div className="overflow-y-auto max-h-[600px] w-full">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Attendee Details</th>
                      <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                      <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Check-In Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendees?.map((a, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="font-bold text-slate-900 text-base">{a.name || 'Anonymous'}</div>
                          <div className="text-slate-500 font-mono text-xs mt-1">{a.email}</div>
                        </td>
                        <td className="px-8 py-4">
                          {a.checkedIn ? (
                            <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">Checked In</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 px-3 py-1 font-medium">Pending</Badge>
                          )}
                        </td>
                        <td className="px-8 py-4 text-slate-500 font-medium">
                          {a.checkedInAt ? new Date(a.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                      </tr>
                    ))}
                    {(!attendees || attendees.length === 0) && (
                      <tr>
                        <td colSpan={3} className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <Users className="w-12 h-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium text-slate-600">No attendees yet</p>
                            <p className="text-sm mt-1">Upload a CSV roster to populate this list.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-slate-100 rounded-3xl overflow-hidden group hover:shadow-md transition-all">
      <CardContent className="p-8 flex items-center justify-between bg-white">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
