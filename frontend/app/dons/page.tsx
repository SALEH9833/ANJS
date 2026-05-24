'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, CheckCircle, HandHeart, Users, GraduationCap, Smartphone, CreditCard, Banknote, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import Counter from '@/components/animations/Counter';

const AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

const PAYMENT_METHODS = [
  { id: 'AIRTEL_MONEY', label: 'Airtel Money', icon: Smartphone, color: 'text-red-600', bg: 'bg-red-50', number: '' },
  { id: 'MOOV_MONEY', label: 'Moov Money', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50', number: '' },
  { id: 'BANK_TRANSFER', label: 'Virement bancaire', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50', number: '' },
  { id: 'OTHER', label: 'Autre', icon: CreditCard, color: 'text-gray-600', bg: 'bg-gray-50', number: '' },
];

export default function DonsPage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [method, setMethod] = useState('AIRTEL_MONEY');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async () => {
    if (!finalAmount || finalAmount < 100) { toast.error('Montant minimum : 100 FCFA'); return; }
    setLoading(true);
    try {
      await api.post('/api/donations', {
        donorName: anonymous ? null : name,
        donorEmail: anonymous ? null : email,
        donorPhone: phone || null,
        amount: finalAmount,
        paymentMethod: method,
        isAnonymous: anonymous,
      });
      setDone(true);
      toast.success('Merci pour votre don !');
    } catch { toast.error('Erreur. Réessayez.'); }
    finally { setLoading(false); }
  };

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method);

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
              Votre don de <span className="font-bold text-emerald-800">{finalAmount.toLocaleString('fr-FR')} FCFA</span> a été enregistré avec succès.
            </p>
            {method !== 'OTHER' && (
              <Card className="border-emerald-200 bg-emerald-50/50 mb-6">
                <CardContent className="p-5 text-left">
                  <p className="font-semibold text-emerald-800 mb-2">Prochaine étape :</p>
                  <p className="text-sm text-emerald-700/70">
                    {method === 'BANK_TRANSFER'
                      ? 'Effectuez le virement bancaire avec la référence de votre don. Un membre vous contactera pour confirmer la réception.'
                      : `Envoyez ${finalAmount.toLocaleString('fr-FR')} FCFA via ${selectedMethod?.label}. Un membre de l'équipe confirmera votre don.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
            <Button onClick={() => { setDone(false); setStep(1); setCustomAmount(''); }} variant="outline" className="gap-2">
              Faire un autre don <ArrowRight className="h-4 w-4" />
            </Button>
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
              { icon: Users, title: 'Transparence', desc: 'Suivi complet de l\'utilisation des fonds', bg: 'bg-blue-50', color: 'text-blue-600' },
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
                    <p className="text-sm text-white/70">Étape {step}/3</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3].map((s) => (
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
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" id="anonymous" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded border-gray-300" />
                      <Label htmlFor="anonymous" className="text-sm cursor-pointer">Don anonyme</Label>
                    </div>
                    {!anonymous && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Votre nom</Label>
                          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ahmed Moussa" className="h-11" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Email</Label>
                          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ahmed@email.com" className="h-11" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Téléphone (pour confirmation)</Label>
                      <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+235 XX XX XX XX" className="h-11" />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">Retour</Button>
                      <Button onClick={() => setStep(3)} className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 gap-2">
                        Continuer <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Mode de paiement</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMethod(m.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              method === m.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                            }`}
                          >
                            <m.icon className={`h-6 w-6 ${m.color} mb-2`} />
                            <p className="font-semibold text-sm">{m.label}</p>
                          </button>
                        ))}
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
                            <span className="text-gray-500">Paiement</span>
                            <span className="text-gray-700">{selectedMethod?.label}</span>
                          </div>
                          {!anonymous && name && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Donateur</span>
                              <span className="text-gray-700">{name}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">Retour</Button>
                      <Button onClick={handleSubmit} disabled={loading} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-base font-semibold gap-2">
                        <Heart className="h-5 w-5" />
                        {loading ? 'Envoi...' : 'Confirmer le don'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
