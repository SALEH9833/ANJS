'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/contact', form);
      setSent(true);
      toast.success('Message envoyé !');
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Message envoyé !</h1>
        <p className="text-muted-foreground">Nous vous répondrons dans les plus brefs délais.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">Contactez-nous</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Nous écrire</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Une question, une suggestion ou envie de collaborer ? N&apos;hésitez pas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <a href="mailto:contact@anjs.org" className="text-sm text-muted-foreground hover:text-primary">contact@anjs.org</a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-sm">Téléphone</p>
                <p className="text-sm text-muted-foreground">+235 XX XX XX XX</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-sm">Adresse</p>
                <p className="text-sm text-muted-foreground">N&apos;Djamena, Tchad</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" required minLength={2} value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input id="subject" required minLength={3} value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required minLength={10} rows={5} value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <Button type="submit" disabled={loading} className="gap-2 w-full sm:w-auto">
                <Send className="h-4 w-4" />
                {loading ? 'Envoi...' : 'Envoyer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
