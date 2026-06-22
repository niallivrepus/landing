import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { cn } from "../../lib/utils";
import { SPRING_CONFIGS } from "../../lib/utils/animations";
import { ChatBubbleButton } from "./chat-bubble-button";
import { Avatar, type AvatarProps } from "./avatar";
import { Badge } from "./badge";

/**
 * PortalAnimation — Multi-step spectral sequence (nested composition)
 *
 * Composes: ChatBubbleButton (empty/portal) + Avatar hype train + Badge
 *
 * Phases (~1.8s total):
 *   0ms   idle      — neutral glass pill (ChatBubbleButton empty)
 *   500ms spectral  — spectral border animates vertically
 *  1000ms avatar-1  — first avatar slides out from behind pill
 *  1120ms avatar-2  — second avatar (120ms stagger)
 *  1240ms avatar-3  — third avatar (120ms stagger)
 *  1500ms badge     — count badge fades in
 */

interface PortalAnimationProps {
  participants: Array<{
    src: string;
    originColor?: AvatarProps["originColor"];
  }>;
  count?: number;
  autoPlay?: boolean;
  className?: string;
}

interface PortalAnimationHandle {
  play: () => void;
}

const AVATAR_SIZE = 18; // matches Avatar "micro" width
const AVATAR_STAGGER = 120; // ms between each avatar
const PILL_W = 12;

const PortalAnimation = forwardRef<PortalAnimationHandle, PortalAnimationProps>(
  function PortalAnimation({ participants, count, autoPlay = true, className }, ref) {
    const [phase, setPhase] = useState<"idle" | "spectral" | "avatars" | "badge">("idle");
    const badgeControls = useAnimation();
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Clear all timers on unmount
    useEffect(() => {
      return () => timersRef.current.forEach(clearTimeout);
    }, []);

    useEffect(() => {
      if (!autoPlay) return;
      play();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay]);

    function play() {
      // Reset
      setPhase("idle");
      badgeControls.set({ opacity: 0, scale: 0.8 });
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      // Phase 1: spectral border fades in
      timersRef.current.push(setTimeout(() => setPhase("spectral"), 500));

      // Phase 2: avatars start sliding out
      timersRef.current.push(setTimeout(() => setPhase("avatars"), 1000));

      // Phase 3: badge fades in
      if (count !== undefined && count >= 3) {
        timersRef.current.push(
          setTimeout(() => {
            setPhase("badge");
            badgeControls.start({
              opacity: 1,
              scale: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            });
          }, 1500),
        );
      }
    }

    useImperativeHandle(ref, () => ({ play }));

    const showAvatars = phase === "avatars" || phase === "badge";
    const spectralActive = phase === "spectral" || phase === "avatars" || phase === "badge";

    return (
      <div className={cn("relative inline-flex items-center", className)}>
        {/* Portal pill — leftmost, behind avatars (z-0) */}
        <ChatBubbleButton
          variant="empty"
          spectralAnimated={spectralActive}
          className="relative z-10"
          style={{
            transition: "border-color 300ms ease",
          }}
        />

        {/* Avatar hype train — each wraps a real Avatar component */}
        <div
          className="flex items-center"
          style={{ clipPath: "inset(-50% -50% -50% 0px)" }}
        >
          {participants.map((p, i) => (
            <motion.div
              key={i}
              initial={{ x: -(AVATAR_SIZE + PILL_W) }}
              animate={
                showAvatars
                  ? { x: 0 }
                  : { x: -(AVATAR_SIZE + PILL_W) }
              }
              transition={{
                type: "spring",
                ...SPRING_CONFIGS.snappy,
                delay: showAvatars ? (i * AVATAR_STAGGER) / 1000 : 0,
              }}
              className="relative"
              style={{
                marginLeft: -8,
                zIndex: participants.length - i,
              }}
            >
              <Avatar
                src={p.src}
                size="micro"
                borderStyle="origins"
                originColor={p.originColor ?? "aether"}
                disableNavigation
                ignoreProfileImage
              />
            </motion.div>
          ))}
        </div>

        {/* Badge — right of avatars, fades in last */}
        {count !== undefined && count >= 3 && (
          <motion.div
            animate={badgeControls}
            initial={{ opacity: 0, scale: 0.8 }}
            className="ml-1.5"
          >
            <Badge
              variant="outline"
              color="neutral"
              type="text"
              size="default"
              label={`+${count}`}
            />
          </motion.div>
        )}
      </div>
    );
  },
);

export { PortalAnimation, type PortalAnimationProps, type PortalAnimationHandle };
