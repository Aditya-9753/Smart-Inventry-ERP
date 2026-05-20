import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
    const { user } = useAuth();

    const can = (action, module) => {
        if (!user || !user.role_id) return false;
        
        const role = user.role_id.toUpperCase();
        
        // Admin can do anything
        if (role === 'ADMIN') return true;

        // Simple hardcoded mapping based on earlier RBAC matrix
        // Normally this would come from the JWT token or an API call detailing permissions
        const permissions = {
            MANAGER: {
                products: ['read', 'write'],
                inventory: ['read', 'write'],
                warehouses: ['read', 'write'],
                reports: ['read'],
                analytics: ['read']
            },
            STAFF: {
                products: ['read'],
                inventory: ['read', 'write']
            },
            VIEWER: {
                dashboard: ['read'],
                inventory: ['read'],
                reports: ['read'],
                products: ['read']
            }
        };

        const rolePerms = permissions[role];
        if (!rolePerms || !rolePerms[module]) return false;

        return rolePerms[module].includes(action);
    };

    return { can };
};
