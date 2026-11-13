import torch
import torch.nn as nn
import numpy as np
from PIL import Image, ImageEnhance
import gc

class DecomNet(nn.Module):
    def __init__(self, channel=64):
        super(DecomNet, self).__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, channel, 3, padding=1), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(channel, channel, 3, padding=1), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(channel, 4, 3, padding=1), nn.Sigmoid()
        )
    def forward(self, x):
        out = self.net(x)
        return out[:, 0:3, :, :], out[:, 3:4, :, :]

class RestormerBlock(nn.Module):
    def __init__(self, dim, num_heads=1):
        super(RestormerBlock, self).__init__()
        self.num_heads = num_heads
        self.temperature = nn.Parameter(torch.ones(num_heads, 1, 1))

        self.qkv = nn.Conv2d(dim, dim*3, kernel_size=1, bias=False)
        self.qkv_dwconv = nn.Conv2d(dim*3, dim*3, kernel_size=3, stride=1, padding=1, groups=dim*3, bias=False)
        self.project_out = nn.Conv2d(dim, dim, kernel_size=1, bias=False)

    def forward(self, x):
        b, c, h, w = x.shape
        res = x
        qkv = self.qkv_dwconv(self.qkv(x))
        q, k, v = qkv.chunk(3, dim=1)
        q = q.reshape(b, self.num_heads, c // self.num_heads, -1)
        k = k.reshape(b, self.num_heads, c // self.num_heads, -1)
        v = v.reshape(b, self.num_heads, c // self.num_heads, -1)

        q = torch.nn.functional.normalize(q, dim=-1)
        k = torch.nn.functional.normalize(k, dim=-1)
        attn = (q @ k.transpose(-2, -1)) * self.temperature
        attn = attn.softmax(dim=-1)

        out = (attn @ v)
        out = out.reshape(b, c, h, w)

        out = self.project_out(out)
        return res + out

class KinD_Restormer_Hybrid(nn.Module):
    def __init__(self):
        super(KinD_Restormer_Hybrid, self).__init__()
        self.decom = DecomNet()
        self.restoration = RestormerBlock(dim=3)

    def forward(self, x):
        r, i = self.decom(x)
        r_enhanced = self.restoration(r)
        return r_enhanced * i

def load_ai_model(weight_path):
   
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = KinD_Restormer_Hybrid().to(device)
    
    model.load_state_dict(torch.load(weight_path, map_location=device, weights_only=True))
    model.eval()
    return model, device

def enhance_image(model, device, pil_image):
    img_np = np.asarray(pil_image).astype(np.float32) / 255.0
    img_t = torch.from_numpy(img_np.transpose(2, 0, 1)).float().unsqueeze(0).to(device)
    
    with torch.no_grad():
        pred = model(img_t).clamp(0, 1)
        
    pred_np = pred.squeeze(0).permute(1, 2, 0).cpu().numpy()
    pred_uint8 = (pred_np * 255.0).round().astype(np.uint8)
    
    result_image = Image.fromarray(pred_uint8)
    
    brightness_enhancer = ImageEnhance.Brightness(result_image)
    result_image = brightness_enhancer.enhance(1.1) 
    
    contrast_enhancer = ImageEnhance.Contrast(result_image)
    result_image = contrast_enhancer.enhance(1.1)  
    
    sharpness_enhancer = ImageEnhance.Sharpness(result_image)
    result_image = sharpness_enhancer.enhance(1.2) 
    
    color_enhancer = ImageEnhance.Color(result_image)
    result_image = color_enhancer.enhance(1.05)
  
    gc.collect()
    
    return result_image