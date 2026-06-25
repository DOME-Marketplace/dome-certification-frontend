# Dome Certification - Deployment Status

## Image
- **Frontend**: `bfeitaisuw/dome-compliance-frontend:dev-1.1.12`
- **Platform**: linux/amd64 (built with `--platform linux/amd64`)
- **Registry**: Docker Hub (public)

## Environment Configuration
- **Namespace**: `dome-certification`
- **Domain**: `dome-certification.dome-marketplace-dev.org`
- **API**: `dome-certification-api.dome-marketplace-dev.org`

### LEAR Credential (CLIENT_ID)
```
did:key:zDnaet3QSWSvr6mqtitJaVd1g5Jzkz72CJidY8nKtEn2V8GqP
```

### Endpoints
- **Frontend**: https://dome-certification.dome-marketplace-dev.org
- **API**: https://dome-certification-api.dome-marketplace-dev.org
- **Verifier**: https://verifier.dome-marketplace-dev.org
- **Issuer**: https://issuer.dome-marketplace-dev.org

## Kubernetes Resources

### Services
- `certification-frontend-svc` - ClusterIP:80
- `certification-backend-svc` - ClusterIP:8080
- `dekra-postgres` - ClusterIP:5432

### Volumes (Deleted)
- `dome-certification-upload-pvc` - DELETED (needs recreation)
- `data-dekra-postgres-0` - Still exists

## Issues Encountered

### 1. Image Architecture Mismatch
- **Problem**: Image built for ARM (Mac M1) but cluster uses x86_64
- **Solution**: Build with `--platform linux/amd64`

### 2. Volume Attachment
- **Problem**: PVC stuck attached to old node
- **Solution**: Deleted PVC, needs recreation

## Commands

### Build & Push
```bash
docker build --platform linux/amd64 --build-arg BUILD_ENV=test -t bfeitaisuw/dome-compliance-frontend:dev-1.1.12 .
docker push bfeitaisuw/dome-compliance-frontend:dev-1.1.12
```

### Deploy
```bash
kubectl set image deployment/certification-frontend certification-frontend=bfeitaisuw/dome-compliance-frontend:dev-1.1.12 -n dome-certification
kubectl rollout restart deployment/certification-backend -n dome-certification
```

### Check Status
```bash
kubectl get pods -n dome-certification
kubectl get svc -n dome-certification
kubectl get events -n dome-certification --sort-by='.lastTimestamp'
```

## Next Steps
1. Recreate PVC: `dome-certification-upload-pvc`
2. Wait for backend pods to start
3. Test frontend access
4. Verify API authentication works
