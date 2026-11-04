import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk'

const MediaTile = ({ className, participant, fallbackText, title, role }) => (
  <section className={`medical-video-call__tile ${className}`}>
    {participant ? (
      <ParticipantView participant={participant} />
    ) : (
      <div className="medical-video-call__waiting">
        <div className="medical-video-call__avatar">{title?.charAt(0)?.toUpperCase() || '?'}</div>
        <strong>{title}</strong>
        <span>{fallbackText}</span>
      </div>
    )}
    <div className="medical-video-call__name">
      <span>{title}</span>
      <small>{role}</small>
    </div>
  </section>
)

/**
 * A dedicated consultation canvas.  Stream's ParticipantView deliberately
 * owns a video element, so it must have a real 100% sized parent rather than
 * be placed in a flex row with an intrinsic video size.  Keeping the remote
 * participant as the stage and the local preview as a responsive overlay
 * gives every device the same predictable consultation layout.
 */
const MedicalVideoCall = ({ onEndCall, remoteRole = 'Participant', localRole = 'You' }) => {
  const { useCallCallingState, useParticipants, useMicrophoneState, useCameraState } = useCallStateHooks()
  const callingState = useCallCallingState()
  const participants = useParticipants()
  const micState = useMicrophoneState()
  const cameraState = useCameraState()

  if (callingState !== 'joined') {
    return (
      <div className="medical-video-call medical-video-call--joining">
        <div className="medical-video-call__joining-content">
          <div className="spinner-border text-light" role="status"><span className="visually-hidden">Joining the call</span></div>
          <p>Joining your secure consultation…</p>
        </div>
      </div>
    )
  }

  const localParticipant = participants.find((participant) => participant.isLocalParticipant)
  const remoteParticipant = participants.find((participant) => !participant.isLocalParticipant) || null
  const participantName = (participant, fallback) => participant?.user?.name || participant?.name || fallback
  const remoteName = participantName(remoteParticipant, remoteRole)
  const localName = participantName(localParticipant, 'You')

  const toggleMicrophone = async () => {
    if (micState.microphone.enabled) await micState.microphone.disable()
    else await micState.microphone.enable()
  }

  const toggleCamera = async () => {
    if (cameraState.camera.enabled) await cameraState.camera.disable()
    else await cameraState.camera.enable()
  }

  return (
    <div className="medical-video-call">
      <style>{`
        .medical-video-call { position: fixed; inset: 0; z-index: 2000; min-height: 100svh; min-height: 100dvh; overflow: hidden; isolation: isolate; background: #071a25; color: #fff; font-family: inherit; }
        .medical-video-call--joining { display: grid; place-items: center; background: radial-gradient(circle at center, #155c73 0%, #071a25 72%); }
        .medical-video-call__joining-content { display: grid; justify-items: center; gap: 16px; color: #fff; }
        .medical-video-call__stage { position: relative; width: 100%; height: 100svh; height: 100dvh; min-height: 100vh; background: #102b39; }
        .medical-video-call__tile { position: relative; overflow: hidden; background: #163847; }
        .medical-video-call__tile .str-video__participant-view,
        .medical-video-call__tile .str-video__participant-view video,
        .medical-video-call__tile .str-video__participant-view iframe { display: block; width: 100% !important; height: 100% !important; min-width: 0 !important; min-height: 0 !important; max-width: none !important; max-height: none !important; object-fit: cover !important; }
        .medical-video-call__tile .str-video__participant-view { position: absolute; inset: 0; background: #163847; }
        .medical-video-call__remote { position: absolute; inset: 0; border-radius: 0; }
        .medical-video-call__remote::after { position: absolute; right: 0; bottom: 0; left: 0; height: 35%; background: linear-gradient(transparent, rgba(0, 0, 0, .52)); content: ''; pointer-events: none; }
        .medical-video-call__local { position: absolute; top: max(76px, calc(env(safe-area-inset-top) + 56px)); right: max(12px, env(safe-area-inset-right)); z-index: 3; width: clamp(108px, 30vw, 156px); aspect-ratio: 3 / 4; border: 2px solid rgba(255, 255, 255, .92); border-radius: 16px; box-shadow: 0 10px 28px rgba(0, 0, 0, .52); background: #244c5e; }
        .medical-video-call__waiting { display: flex; width: 100%; height: 100%; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 24px; color: rgba(255, 255, 255, .92); text-align: center; }
        .medical-video-call__waiting span { color: rgba(255, 255, 255, .72); font-size: 14px; }
        .medical-video-call__avatar { display: grid; width: 76px; aspect-ratio: 1; place-items: center; border-radius: 50%; background: #0ba4a6; font-size: 30px; font-weight: 700; }
        .medical-video-call__name { position: absolute; right: 14px; bottom: 16px; left: 14px; z-index: 2; display: flex; flex-direction: column; gap: 2px; pointer-events: none; text-shadow: 0 1px 4px #000; }
        .medical-video-call__local .medical-video-call__name { right: 8px; bottom: 8px; left: 8px; }
        .medical-video-call__name span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; font-weight: 700; }
        .medical-video-call__name small { color: rgba(255, 255, 255, .78); font-size: 12px; }
        .medical-video-call__header { position: absolute; inset: 0 0 auto; z-index: 4; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: max(18px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right)) 56px max(18px, env(safe-area-inset-left)); background: linear-gradient(180deg, rgba(0, 0, 0, .76), rgba(0, 0, 0, .3) 55%, transparent); pointer-events: none; }
        .medical-video-call__header strong { display: block; overflow: hidden; max-width: 62vw; text-overflow: ellipsis; white-space: nowrap; font-size: 17px; line-height: 1.35; }
        .medical-video-call__header span { color: rgba(255, 255, 255, .82); font-size: 13px; }
        .medical-video-call__status { display: flex; flex-shrink: 0; align-items: center; gap: 7px; padding: 5px 9px; border-radius: 999px; background: rgba(0, 0, 0, .28); color: rgba(255, 255, 255, .9); font-size: 12px; }
        .medical-video-call__status::before { width: 8px; height: 8px; border-radius: 50%; background: #36d399; box-shadow: 0 0 0 3px rgba(54, 211, 153, .2); content: ''; }
        .medical-video-call__controls { position: absolute; right: 0; bottom: 0; left: 0; z-index: 4; display: flex; align-items: center; justify-content: center; gap: clamp(18px, 8vw, 36px); padding: 52px max(20px, env(safe-area-inset-right)) max(26px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left)); background: linear-gradient(0deg, rgba(0, 0, 0, .92), rgba(0, 0, 0, .45) 44%, transparent); }
        .medical-video-call__button { display: grid; width: 58px; min-width: 58px; aspect-ratio: 1; place-items: center; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .22); box-shadow: 0 4px 14px rgba(0, 0, 0, .2); color: #fff; font-size: 21px; transition: transform .15s ease, background .15s ease; touch-action: manipulation; }
        .medical-video-call__button:hover { background: rgba(255, 255, 255, .34); transform: scale(1.06); }
        .medical-video-call__button:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .medical-video-call__button--disabled { background: #ca5261; }
        .medical-video-call__button--end { width: 70px; min-width: 70px; background: #e74c5b; font-size: 25px; }
        @media (min-width: 768px) { .medical-video-call__local { top: max(84px, calc(env(safe-area-inset-top) + 64px)); right: 28px; width: min(22vw, 282px); border-radius: 18px; } .medical-video-call__header { padding-right: 28px; padding-left: 28px; } .medical-video-call__controls { padding-bottom: 34px; } }
        @media (max-width: 380px) { .medical-video-call__local { top: max(68px, calc(env(safe-area-inset-top) + 50px)); right: 10px; width: 104px; } .medical-video-call__button { width: 54px; min-width: 54px; font-size: 19px; } .medical-video-call__button--end { width: 64px; min-width: 64px; } .medical-video-call__controls { gap: 15px; padding-top: 44px; } }
        @media (max-height: 520px) and (orientation: landscape) { .medical-video-call__local { top: 16px; width: 108px; } .medical-video-call__header { padding-top: 14px; padding-bottom: 36px; } .medical-video-call__controls { padding-top: 26px; padding-bottom: 16px; } .medical-video-call__button { width: 50px; min-width: 50px; font-size: 18px; } .medical-video-call__button--end { width: 58px; min-width: 58px; } }
      `}</style>
      <main className="medical-video-call__stage">
        <MediaTile className="medical-video-call__remote" participant={remoteParticipant} fallbackText={`Waiting for ${remoteRole.toLowerCase()} to join…`} title={remoteName} role={remoteRole} />
        <MediaTile className="medical-video-call__local" participant={localParticipant} fallbackText="Starting your camera…" title={localName} role={localRole} />
        <header className="medical-video-call__header">
          <div><strong>{remoteName}</strong><span>Secure video consultation</span></div>
          <div className="medical-video-call__status">Connected</div>
        </header>
        <footer className="medical-video-call__controls" aria-label="Call controls">
          <button className={`medical-video-call__button ${micState.microphone.enabled ? '' : 'medical-video-call__button--disabled'}`} onClick={toggleMicrophone} title={micState.microphone.enabled ? 'Mute microphone' : 'Unmute microphone'} aria-label={micState.microphone.enabled ? 'Mute microphone' : 'Unmute microphone'}><i className={`fa-solid ${micState.microphone.enabled ? 'fa-microphone' : 'fa-microphone-slash'}`} /></button>
          <button className="medical-video-call__button medical-video-call__button--end" onClick={onEndCall} title="End call" aria-label="End call"><i className="fa-solid fa-phone-slash" /></button>
          <button className={`medical-video-call__button ${cameraState.camera.enabled ? '' : 'medical-video-call__button--disabled'}`} onClick={toggleCamera} title={cameraState.camera.enabled ? 'Turn camera off' : 'Turn camera on'} aria-label={cameraState.camera.enabled ? 'Turn camera off' : 'Turn camera on'}><i className={`fa-solid ${cameraState.camera.enabled ? 'fa-video' : 'fa-video-slash'}`} /></button>
        </footer>
      </main>
    </div>
  )
}

export default MedicalVideoCall
