"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Eye,
  Clock,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { getWellbeingSettings, updateWellbeingSettings, deleteAccount } from "@/lib/posts";
import { WellbeingSettings } from "@/lib/types";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function ToggleSwitch({ enabled, onToggle, disabled }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        enabled ? "bg-primary" : "bg-muted",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "absolute top-1 left-1 w-4 h-4 rounded-full bg-card transition-transform",
          enabled && "translate-x-5",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [settings, setSettings] = useState<WellbeingSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    getWellbeingSettings()
      .then((s) => {
        setSettings(s);
        // Sincroniza dark mode com estado do servidor
        document.documentElement.classList.toggle("dark", s.darkMode);
        localStorage.setItem("entrelinhas_dark_mode", String(s.darkMode));
      })
      .catch(() => {
        setSettings({
          reducedNotifications: true,
          hideInteractions: false,
          limitedFeed: true,
          silentMode: false,
          darkMode: false,
        });
      });
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (deleting || confirmText !== "CONFIRMAR") return;
    setDeleting(true);
    try {
      await deleteAccount();
      logout();
      router.push("/");
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setConfirmText("");
    }
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setConfirmText("");
  };

  const toggleSetting = (key: keyof WellbeingSettings) => {
    if (!settings || saving) return;

    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    // Aplica dark mode imediatamente sem esperar API
    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", updated.darkMode);
      localStorage.setItem("entrelinhas_dark_mode", String(updated.darkMode));
    }

    setSaving(true);
    updateWellbeingSettings({ [key]: updated[key] })
      .then(setSettings)
      .catch(() => {
        setSettings(settings);
        // Reverte dark mode se API falhou
        if (key === "darkMode") {
          document.documentElement.classList.toggle("dark", settings.darkMode);
          localStorage.setItem("entrelinhas_dark_mode", String(settings.darkMode));
        }
      })
      .finally(() => setSaving(false));
  };

  const loading = settings === null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao perfil
        </Link>
        <h1 className="text-2xl font-light text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Personalize sua experiência no Entrelinhas.
        </p>
      </div>

      {/* Well-being Section */}
      <section className="mb-10">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          Bem-estar digital
        </h2>
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          <SettingItem
            icon={<Bell className="h-5 w-5" />}
            title="Notificações reduzidas"
            description="Receba apenas notificações essenciais, sem interrupções constantes."
          >
            <ToggleSwitch
              enabled={settings?.reducedNotifications ?? true}
              onToggle={() => toggleSetting("reducedNotifications")}
              disabled={loading || saving}
            />
          </SettingItem>

          <SettingItem
            icon={<Eye className="h-5 w-5" />}
            title="Ocultar interações"
            description="Esconda o número de pessoas que se conectaram com seus registros."
          >
            <ToggleSwitch
              enabled={settings?.hideInteractions ?? false}
              onToggle={() => toggleSetting("hideInteractions")}
              disabled={loading || saving}
            />
          </SettingItem>

          <SettingItem
            icon={<Clock className="h-5 w-5" />}
            title="Feed limitado"
            description="Veja menos publicações por dia para um consumo mais consciente."
          >
            <ToggleSwitch
              enabled={settings?.limitedFeed ?? true}
              onToggle={() => toggleSetting("limitedFeed")}
              disabled={loading || saving}
            />
          </SettingItem>

          <SettingItem
            icon={<Moon className="h-5 w-5" />}
            title="Modo silencioso"
            description="Desative todas as notificações e interações por um período."
          >
            <ToggleSwitch
              enabled={settings?.silentMode ?? false}
              onToggle={() => toggleSetting("silentMode")}
              disabled={loading || saving}
            />
          </SettingItem>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="mb-10">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          Aparência
        </h2>
        <div className="bg-card rounded-xl border border-border/50">
          <SettingItem
            icon={<Moon className="h-5 w-5" />}
            title="Modo escuro"
            description="Alterne entre o tema claro e escuro."
          >
            <ToggleSwitch
              enabled={settings?.darkMode ?? false}
              onToggle={() => toggleSetting("darkMode")}
              disabled={loading || saving}
            />
          </SettingItem>
        </div>
      </section>

      {/* Account Section */}
      <section className="mb-10">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          Conta
        </h2>
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          <SettingLink
            icon={<Shield className="h-5 w-5" />}
            title="Privacidade"
            description="Gerencie suas configurações de privacidade."
            href="/settings/privacy"
          />
          <SettingLink
            icon={<HelpCircle className="h-5 w-5" />}
            title="Ajuda e suporte"
            description="Dúvidas? Estamos aqui para ajudar."
            href="/settings/help"
          />
        </div>
      </section>

      {/* Logout + Delete account */}
      <div className="pt-6 border-t border-border/50 space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair da conta</span>
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-3 text-muted-foreground hover:text-destructive transition-colors text-sm"
        >
          <span>Excluir minha conta</span>
        </button>
      </div>

      {/* Delete account confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="bg-card border border-border/50 rounded-2xl w-full max-w-sm p-8 text-center">
            <p className="text-2xl mb-4">✦</p>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Seu espaço vai fazer falta.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Tudo que você escreveu aqui — cada registro, cada reflexão — será apagado para sempre.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Se quiser, você pode simplesmente fazer uma pausa e voltar quando sentir vontade. Seu espaço estará esperando por você.
            </p>
            <div className="mb-6 text-left">
              <label className="block text-sm text-muted-foreground mb-2">
                Para confirmar, digite{" "}
                <span className="font-mono text-foreground">CONFIRMAR</span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRMAR"
                className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-ring font-mono placeholder:text-muted-foreground/40"
              />
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCloseDeleteConfirm}
                className="w-full py-2.5 px-4 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                Fazer uma pausa por agora
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || confirmText !== "CONFIRMAR"}
                className="w-full py-2.5 px-4 text-muted-foreground hover:text-destructive transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? "Excluindo..." : "Excluir minha conta definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingItem({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-start gap-4">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingLink({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
    </Link>
  );
}
