'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, CheckCircle, HandHeart, GraduationCap, MessageCircle, ArrowRight, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import Counter from '@/components/animations/Counter';

const AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];
const WHATSAPP_NUMBER = '23560935774';

export default function DonsPage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ donors: 0, amount: 0 });
  const [c, setC] = useState<Record<string, string>>({});

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/content`)
      .then(r => r.json()).then(d => setC(d.data || {})).catch(() => {});
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/donations/stats`)
      .then(r => r.json()).then(d => { if (d.data) setStats(d.data); }).catch(() => {});
  }, []);

  const buildWhatsAppUrl = () => {
    const lines = [
      `Bonjour ANJS,`,
      ``,
      `Je souhaite faire un don de *${finalAmount.toLocaleString('fr-FR')} FCFA*.`,
      ``,
    ];
    if (name) lines.push(`Nom : ${name}`);
    if (phone) lines.push(`Téléphone : ${phone}`);
    if (message) { lines.push(``); lines.push(`Message : ${message}`); }
    lines.push(``);
    lines.push(`Merci de me communiquer les modalités de paiement.`);
    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const handleSend = () => {
    if (!finalAmount || finalAmount < 100) { toast.error('Montant minimum : 100 FCFA'); return; }
    window.open(buildWhatsAppUrl(), '_blank');
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <FadeIn>
          <div className="text-center max-w-md">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-extrabold text-emerald-900 mb-3">Merci pour votre générosité !</h1>
            <p className="text-lg text-emerald-700/70 mb-6">
              Votre intention de don de <span className="font-bold text-emerald-800">{finalAmount.toLocaleString('fr-FR')} FCFA</span> a bien été transmise via WhatsApp.
            </p>
            <Card className="border-emerald-200 bg-emerald-50/50 mb-6">
              <CardContent className="p-5 text-left">
                <p className="font-semibold text-emerald-800 mb-2">Prochaine étape :</p>
                <p className="text-sm text-emerald-700/70">
                  Un membre de l&apos;équipe ANJS vous répondra sur WhatsApp avec les modalités de paiement. Vous pourrez convenir ensemble du mode de transfert le plus pratique.
                </p>
              </CardContent>
            </Card>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => { setDone(false); setStep(1); setCustomAmount(''); setName(''); setPhone(''); setMessage(''); }} variant="outline" className="gap-2">
                Faire un autre don <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => window.open(buildWhatsAppUrl(), '_blank')} className="gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4" /> Renvoyer sur WhatsApp
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={c.cta_image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&h=600&fit=crop'}
            alt="Solidarité"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-emerald-800/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <FadeIn>
            <Badge className="bg-white/15 text-white border-0 mb-5 backdrop-blur-sm text-sm px-4 py-1.5">Solidarité</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Faire un{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-emerald-200">don</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              {c.cta_description || "Votre contribution aide des familles dans le besoin. Chaque geste compte."}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold"><Counter target={stats.donors} /></div>
                <p className="text-sm text-white/60">Donateurs</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold"><Counter target={stats.amount} /> <span className="text-lg">FCFA</span></div>
                <p className="text-sm text-white/60">Collectés</p>
              </div>
            </div>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 px-4 -mt-12 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" staggerDelay={0.1}>
            {[
              { icon: HandHeart, title: 'Aide directe', desc: '100% de vos dons vont aux bénéficiaires', bg: 'bg-emerald-50', color: 'text-emerald-600' },
              { icon: Shield, title: 'Sécurisé', desc: 'Contact direct via WhatsApp, aucune donnée bancaire en ligne', bg: 'bg-blue-50', color: 'text-blue-600' },
              { icon: GraduationCap, title: 'Impact local', desc: 'Des jeunes qui changent leur communauté', bg: 'bg-amber-50', color: 'text-amber-600' },
            ].map((v) => (
              <StaggerItem key={v.title}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="border-0 shadow-lg text-center h-full">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center mx-auto mb-4`}>
                        <v.icon className={`h-7 w-7 ${v.color}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{v.title}</h3>
                      <p className="text-sm text-muted-foreground">{v.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <FadeIn>
            <Card className="border-0 shadow-xl max-w-2xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6" />
                  <div>
                    <h2 className="font-bold text-lg">Formulaire de don</h2>
                    <p className="text-sm text-white/70">Étape {step}/2</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[1, 2].map((s) => (
                    <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/30'} transition-colors`} />
                  ))}
                </div>
              </div>

              <CardContent className="p-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Choisissez un montant (FCFA)</Label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {AMOUNTS.map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => { setAmount(a); setCustomAmount(''); }}
                            className={`py-3 px-4 rounded-xl border-2 font-bold text-lg transition-all ${
                              amount === a && !customAmount
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                            }`}
                          >
                            {a.toLocaleString('fr-FR')}
                          </button>
                        ))}
                      </div>
                      <Input
                        type="number"
                        placeholder="Autre montant (min. 100 FCFA)"
                        min={100}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="h-12 text-lg"
                      />
                    </div>
                    <Button onClick={() => setStep(2)} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-base font-semibold gap-2" disabled={!finalAmount || finalAmount < 100}>
                      Continuer <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Votre nom (optionnel)</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ahmed Moussa" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Votre téléphone (optionnel)</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+235 XX XX XX XX" className="h-11" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Message (optionnel)</Label>
                        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Un mot pour accompagner votre don..." rows={3} />
                      </div>
                    </div>

                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Récapitulatif</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Montant</span>
                            <span className="font-bold text-gray-900">{finalAmount.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Contact</span>
                            <span className="text-gray-700 flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5 text-green-600" /> WhatsApp</span>
                          </div>
                          {name && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Donateur</span>
                              <span className="text-gray-700">{name}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Contact sécurisé via WhatsApp</p>
                          <p className="text-xs text-green-600 mt-1">
                            En cliquant sur le bouton, vous serez redirigé vers WhatsApp avec un message pré-rempli. Un membre de l&apos;équipe vous répondra pour organiser le transfert.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">Retour</Button>
                      <Button onClick={handleSend} className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-base font-semibold gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Contacter via WhatsApp
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn>
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-2">Vous pouvez aussi nous contacter directement</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour ANJS, je souhaite faire un don.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                +235 60 93 57 74
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
