import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Map, DollarSign, Calendar, Plane } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative px-6 pb-24">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto pt-20 pb-20 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-badge rounded-full mb-8">
          <Plane className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">v2.0 Beta is here</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          The Smartest Way to <br />
          <span className="gradient-text">Travel with Friends</span>
        </h1>
        
        <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
          Forget about messy chat groups. Organize trips, track shared expenses, and discover destinations—all in one premium interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/registro">
            <Button size="lg" className="w-full sm:w-auto">Start Planning Free</Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Explore Destinations</Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <Card className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Map className="w-6 h-6 text-brand-cyan" />
          </div>
          <CardHeader 
            title="Smart Itinerary" 
            subtitle="Drag-and-drop your daily activities and sync them with your friends in real-time." 
          />
        </Card>

        <Card className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-6 h-6 text-brand-violet" />
          </div>
          <CardHeader 
            title="Split Expenses" 
            subtitle="No more 'who owes what'. Keep track of group spending automatically." 
          />
        </Card>

        <Card className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-6 h-6 text-brand-pink" />
          </div>
          <CardHeader 
            title="Global Sync" 
            subtitle="Plan across devices. Your dream trip is always updated and ready to share." 
          />
        </Card>
      </section>

      {/* Social Proof / Call to action */}
      <section className="max-w-4xl mx-auto mt-32 text-center p-12 glass rounded-[3rem] relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6">Ready to see the world?</h2>
          <p className="text-text-muted mb-10 text-lg">Join 10,000+ travelers planning their dream adventures today.</p>
          <Link href="/registro">
            <Button size="lg" className="px-12">Create My Project</Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-violet/10 blur-[100px] pointer-events-none" />
      </section>
    </div>
  );
}