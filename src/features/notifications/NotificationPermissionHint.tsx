import type { PermissionStateLabel } from '../../shared/types/feature';

type NotificationPermissionHintProps = {
  permission: PermissionStateLabel;
};

export function NotificationPermissionHint({ permission }: NotificationPermissionHintProps) {
  if (permission === 'unsupported') {
    return (
      <div className="permissionHint warning">
        <strong>이 브라우저에서는 알림 권한을 요청할 수 없습니다.</strong>
        <span>iOS에서는 보통 홈 화면에 추가한 PWA에서 알림 권한 흐름이 가장 안정적으로 동작합니다.</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="permissionHint warning">
        <strong>알림 권한이 거부되었습니다.</strong>
        <span>
          브라우저는 같은 알림 권한 팝업을 계속 다시 띄우지 않습니다. iPhone에서는 홈 화면에 추가한 앱의 알림
          설정에서 직접 허용한 뒤 권한 상태를 다시 확인하세요.
        </span>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="permissionHint success">
        <strong>알림 권한이 허용되었습니다.</strong>
        <span>이제 등록된 service worker를 통해 로컬 알림을 표시할 수 있습니다.</span>
      </div>
    );
  }

  return (
    <div className="permissionHint">
      <strong>알림 권한은 사용자 클릭 이후 요청합니다.</strong>
      <span>iOS에서는 홈 화면에 추가한 PWA에서 알림 권한 흐름이 가장 안정적으로 동작합니다.</span>
    </div>
  );
}
